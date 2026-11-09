alter table public.bookings add column if not exists payment_kind text not null default 'full' check(payment_kind in ('deposit','full'));
grant update(payment_kind) on public.bookings to authenticated;
-- Apply after 20261019_studio_management.sql. All reservation writes serialize on one studio lock.
alter table public.bookings add column if not exists slot_kind text not null default 'full-day' check(slot_kind in ('full-day','half-day'));
alter table public.bookings add column if not exists start_minute integer not null default 0;
alter table public.bookings add column if not exists end_minute integer not null default 1440;
alter table public.bookings add column if not exists buffer_minutes integer not null default 0;
alter table public.bookings add column if not exists studio_timezone text not null default 'Africa/Lagos';
alter table public.bookings add column if not exists hold_expires_at timestamptz;
alter table public.bookings add column if not exists hold_expired_notified boolean not null default false;
alter table public.bookings add column if not exists canceled_at timestamptz;
-- Legacy approved unpaid inquiries become temporary holds, not permanent reservations.
update public.bookings set hold_expires_at=now()+interval '48 hours' where status='approved' and payment_status='unpaid' and hold_expires_at is null;
grant update(slot_kind,start_minute,canceled_at) on public.bookings to authenticated;
create index if not exists bookings_reservation_date on public.bookings(date) where status='approved';
create table if not exists public.notification_outbox(
 id uuid primary key default gen_random_uuid(),booking_id uuid references public.bookings(id),event_type text not null,event_key text unique,payload jsonb not null,
 status text not null default 'pending' check(status in ('pending','processing','accepted','failed')),attempts integer not null default 0,
 created_at timestamptz not null default now(),first_attempt_at timestamptz,next_attempt_at timestamptz not null default now(),lease_until timestamptz,
 provider_id text,last_error text,accepted_at timestamptz
);
alter table public.notification_outbox enable row level security;
revoke all on public.notification_outbox from anon,authenticated;
grant select on public.notification_outbox to authenticated;
grant all on public.notification_outbox to service_role;
create policy "Studio reads notifications" on public.notification_outbox for select to authenticated using(exists(select 1 from public.studio_admins where user_id=auth.uid()));
create or replace function public.guard_booking_reservation() returns trigger language plpgsql security definer set search_path=public as $$
declare cfg jsonb; ops jsonb; site jsonb; opened integer; closed integer; duration integer; padding integer; hours integer; lead integer; zone text; schedule_changed boolean; payment_confirmation boolean:=false; starts timestamptz;
begin
 perform pg_advisory_xact_lock(hashtext('john-availability'));
 select content into ops from studio_content where id='operations';
 select content into site from studio_content where id='published';
 cfg:=coalesce(ops->'schedule','{}');
 opened:=coalesce((cfg->>'openMinute')::integer,540);closed:=coalesce((cfg->>'closeMinute')::integer,1080);duration:=coalesce((cfg->>'halfDayMinutes')::integer,240);padding:=coalesce((cfg->>'bufferMinutes')::integer,60);hours:=coalesce((cfg->>'holdHours')::integer,48);lead:=coalesce((cfg->>'leadHours')::integer,0);zone:=coalesce(cfg->>'timezone','Africa/Lagos');
 schedule_changed:=TG_OP='INSERT';
 if TG_OP='UPDATE' then
 payment_confirmation:=new.payment_status='paid' and old.payment_status<>'paid';
 schedule_changed:=(new.date,new.service,new.slot_kind,new.start_minute) is distinct from (old.date,old.service,old.slot_kind,old.start_minute);
 if old.payment_status='paid' and new.status<>'approved' then raise exception 'Use cancellation to release a paid booking';end if;
 if old.payment_status='paid' and new.payment_status<>'paid' then raise exception 'Verified payments are immutable';end if;
 if old.canceled_at is not null and new.canceled_at is null then raise exception 'Create a new inquiry to restore a canceled reservation';end if;
 end if;
 if TG_OP='UPDATE' and new.status='approved' and old.status<>'approved' then schedule_changed:=true;end if;
 if schedule_changed then
 new.studio_timezone:=zone;
 if new.service='Weddings' then new.slot_kind:='full-day';new.start_minute:=0;new.end_minute:=1440;new.buffer_minutes:=0;
 elsif new.slot_kind='full-day' then new.start_minute:=opened;new.end_minute:=closed;new.buffer_minutes:=padding;
 else
 if new.start_minute<opened or new.start_minute+duration>closed or mod(new.start_minute-opened,duration+padding)<>0 then raise exception 'Choose an available half-day start time';end if;
 new.end_minute:=new.start_minute+duration;new.buffer_minutes:=padding;
 end if;
 end if;
 if TG_OP='UPDATE' and new.status='approved' and old.status<>'approved' then new.hold_expires_at:=now()+make_interval(hours=>hours);new.hold_expired_notified:=false;end if;
 if TG_OP='UPDATE' and new.hold_expires_at is distinct from old.hold_expires_at then new.hold_expired_notified:=false;end if;
 -- Validate inserts, reschedules, approvals, renewals and payment confirmation under the same lock.
 if new.canceled_at is null and (schedule_changed or (TG_OP='UPDATE' and (new.status,new.payment_status,new.hold_expires_at) is distinct from (old.status,old.payment_status,old.hold_expires_at))) then
 if new.status<>'declined' then
 if TG_OP='INSERT' and (coalesce((site#>>'{settings,bookingEnabled}')::boolean,true)=false or exists(select 1 from jsonb_array_elements(coalesce(site->'services','[]')) s where s->>'name'=new.service and (s->>'enabled')::boolean=false)) then raise exception 'This service is not accepting inquiries';end if;
 if not payment_confirmation then
 if new.date<((now() at time zone zone)::date) then raise exception 'This date is in the past';end if;
 if cfg ? 'weekdays' and not (cfg->'weekdays' @> to_jsonb(array[extract(dow from new.date)::integer])) then raise exception 'The studio is closed that day';end if;
 if exists(select 1 from jsonb_array_elements(coalesce(ops->'blocks','[]')) x where new.date between (x->>'start')::date and (x->>'end')::date) then raise exception 'This date is blocked';end if;
 starts:=(new.date::timestamp+make_interval(mins=>case when new.service='Weddings' then opened else new.start_minute end)) at time zone new.studio_timezone;
 if starts<now()+make_interval(hours=>lead) then raise exception 'This slot does not meet the booking notice period';end if;
 end if;
 if exists(select 1 from bookings b where b.id<>new.id and b.date=new.date and b.status='approved' and b.canceled_at is null and (b.payment_status='paid' or b.hold_expires_at>now()) and new.start_minute<b.end_minute+b.buffer_minutes and b.start_minute<new.end_minute+new.buffer_minutes) then raise exception 'This date or time was just reserved. Choose another slot';end if;
 if TG_OP='UPDATE' and new.payment_status='paid' and old.payment_status<>'paid' and (old.hold_expires_at is null or old.hold_expires_at<=now()) then raise exception 'Payment received after hold expiry: studio review required';end if;
 end if;
 end if;
 return new;
end $$;
create trigger guard_booking_reservation before insert or update on public.bookings for each row execute function public.guard_booking_reservation();
create or replace function public.queue_booking_notification() returns trigger language plpgsql security definer set search_path=public as $$
declare event text;
begin
 if TG_OP='INSERT' then event:='inquiry_received';
 elsif new.payment_status='paid' and old.payment_status<>'paid' then event:='payment_verified';
 elsif new.canceled_at is not null and old.canceled_at is null then event:='booking_canceled';
 elsif new.hold_expired_notified and not old.hold_expired_notified then event:='hold_expired';
 elsif new.status is distinct from old.status then event:='booking_'||new.status;
 elsif (new.date,new.service,new.slot_kind,new.start_minute) is distinct from (old.date,old.service,old.slot_kind,old.start_minute) then event:='schedule_changed';
 elsif (new.quote_amount_minor,new.quote_currency,new.payment_kind) is distinct from (old.quote_amount_minor,old.quote_currency,old.payment_kind) then event:='quote_updated';
 elsif new.hold_expires_at is distinct from old.hold_expires_at then event:='hold_renewed';
 end if;
 if event is not null then insert into notification_outbox(booking_id,event_type,payload) values(new.id,event,jsonb_build_object('name',new.name,'email',new.email,'service',new.service,'date',new.date,'venue',new.venue,'start_minute',new.start_minute,'end_minute',new.end_minute,'timezone',new.studio_timezone,'hold_expires_at',new.hold_expires_at,'amount_minor',new.quote_amount_minor,'currency',new.quote_currency,'payment_kind',new.payment_kind));end if;
 return new;
end $$;
create trigger queue_booking_notification after insert or update on public.bookings for each row execute function public.queue_booking_notification();
create or replace function public.claim_studio_notifications() returns setof public.notification_outbox language plpgsql security definer set search_path=public as $$
begin
 update bookings set hold_expired_notified=true where status='approved' and payment_status='unpaid' and canceled_at is null and hold_expires_at<=now() and not hold_expired_notified;
 -- Never automatically retry beyond the provider's idempotency window.
 update notification_outbox set status='failed',last_error='Retry window expired. Review provider logs before retrying.',lease_until=null where status in ('pending','processing') and first_attempt_at<now()-interval '23 hours';
 return query with claimed as(select id from notification_outbox where ((status in ('pending','failed') and next_attempt_at<=now()) or (status='processing' and lease_until<now())) and attempts<8 and (first_attempt_at is null or first_attempt_at>now()-interval '23 hours') order by created_at for update skip locked limit 20)
 update notification_outbox n set status='processing',attempts=n.attempts+1,first_attempt_at=coalesce(n.first_attempt_at,now()),lease_until=now()+interval '5 minutes' from claimed c where n.id=c.id returning n.*;
end $$;
revoke all on function public.claim_studio_notifications() from public,anon,authenticated;
grant execute on function public.claim_studio_notifications() to service_role;
revoke all on function public.guard_booking_reservation(),public.queue_booking_notification() from public,anon,authenticated;

create or replace function public.save_studio_content(p_action text,p_content jsonb,p_revision bigint,p_actor uuid) returns bigint language plpgsql security definer set search_path=public as $$
declare current_revision bigint; target text; next_revision bigint;
begin
 perform pg_advisory_xact_lock(hashtext('john-availability'));
 if p_action='operations' and exists(select 1 from bookings b,jsonb_array_elements(coalesce(p_content->'blocks','[]')) x where b.status='approved' and b.canceled_at is null and (b.payment_status='paid' or b.hold_expires_at>now()) and b.date between (x->>'start')::date and (x->>'end')::date) then raise exception 'A blocked date overlaps a held or confirmed booking';end if;
 if p_action not in ('draft','publish','operations') then raise exception 'Invalid action'; end if;
 target:=case when p_action='operations' then 'operations' else 'draft' end;
 perform pg_advisory_xact_lock(hashtext('john-studio-'||target));
 select revision into current_revision from studio_content where id=target for update;
 if coalesce(current_revision,0)<>p_revision then raise exception 'Stale revision';end if;
 next_revision:=coalesce(current_revision,0)+1;
 insert into studio_content(id,content,revision) values(target,p_content,next_revision) on conflict(id) do update set content=excluded.content,revision=excluded.revision,updated_at=now();
 if p_action='publish' then
 insert into studio_content_history(content,actor) select content,p_actor from studio_content where id='published';
 insert into studio_content(id,content,revision) values('published',p_content,next_revision) on conflict(id) do update set content=excluded.content,revision=excluded.revision,updated_at=now();
 end if;
 return next_revision;
end $$;
revoke all on function public.save_studio_content(text,jsonb,bigint,uuid) from public,anon,authenticated;
grant execute on function public.save_studio_content(text,jsonb,bigint,uuid) to service_role;

create or replace function public.record_verified_payment(p_attempt_id uuid,p_booking_id uuid,p_provider text,p_reference text,p_amount bigint,p_currency text) returns void language plpgsql security definer set search_path=public as $$
declare b public.bookings; a public.payment_attempts;
begin
 select * into b from public.bookings where id=p_booking_id for update;
 select * into a from public.payment_attempts where id=p_attempt_id and booking_id=p_booking_id for update;
 if a.id is null or b.id is null or a.provider<>p_provider or a.provider_reference is distinct from p_reference or a.amount_minor<>p_amount or a.currency<>p_currency then raise exception 'Payment does not match checkout'; end if;
 if a.status='succeeded' and b.payment_status='paid' then return; end if;
 if a.status<>'pending' or b.status<>'approved' or b.canceled_at is not null or b.quote_amount_minor is distinct from p_amount or b.quote_currency is distinct from p_currency or b.payment_status='paid' then raise exception 'Booking is not payable'; end if;
 update public.payment_attempts set status='succeeded',paid_at=now() where id=a.id;
 update public.bookings set payment_status='paid',paid_at=now() where id=b.id;
end $$;
revoke all on function public.record_verified_payment(uuid,uuid,text,text,bigint,text) from public,anon,authenticated;
grant execute on function public.record_verified_payment(uuid,uuid,text,text,bigint,text) to service_role;

create or replace function public.protect_paid_quote() returns trigger language plpgsql set search_path=public as $$begin if old.payment_status='paid' and (new.quote_amount_minor,new.quote_currency,new.payment_kind) is distinct from (old.quote_amount_minor,old.quote_currency,old.payment_kind) then raise exception 'A paid quote cannot be changed';end if;return new;end $$;
