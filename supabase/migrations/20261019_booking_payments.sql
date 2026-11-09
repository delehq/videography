-- Apply after schema.sql for an existing project.
alter table public.bookings add column if not exists client_token text not null default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
alter table public.bookings add column if not exists quote_amount_minor bigint check (quote_amount_minor > 0 and quote_amount_minor <= 9007199254740991);
alter table public.bookings add column if not exists quote_currency text check (quote_currency in ('NGN','USD','EUR','GBP','GHS','CAD','AUD','ZAR'));
alter table public.bookings add column if not exists paid_at timestamptz;
create unique index if not exists bookings_client_token_idx on public.bookings(client_token);
grant update(quote_amount_minor,quote_currency) on public.bookings to authenticated;

create table if not exists public.payment_attempts (
 id uuid primary key default gen_random_uuid(),
 booking_id uuid not null references public.bookings(id),
 provider text not null,
 provider_reference text,
 amount_minor bigint not null check (amount_minor > 0),
 currency text not null,
 status text not null default 'pending' check (status in ('pending','succeeded','failed')),
 checkout_url text,
 created_at timestamptz not null default now(),
 paid_at timestamptz,
 unique(provider,provider_reference)
);
create unique index if not exists payment_attempt_one_pending on public.payment_attempts(booking_id) where status='pending';
alter table public.payment_attempts enable row level security;
revoke all on public.payment_attempts from anon,authenticated;
grant select on public.payment_attempts to authenticated;
grant all on public.payment_attempts to service_role;
drop policy if exists "Studio reads payments" on public.payment_attempts;
create policy "Studio reads payments" on public.payment_attempts for select to authenticated using (exists(select 1 from public.studio_admins where user_id=auth.uid()));

create or replace function public.protect_paid_quote() returns trigger language plpgsql set search_path=public as $$
begin
 if old.payment_status='paid' and (new.quote_amount_minor is distinct from old.quote_amount_minor or new.quote_currency is distinct from old.quote_currency) then raise exception 'A paid quote cannot be changed'; end if;
 return new;
end $$;
drop trigger if exists protect_paid_quote on public.bookings;
create trigger protect_paid_quote before update on public.bookings for each row execute function public.protect_paid_quote();

create or replace function public.record_verified_payment(p_attempt_id uuid,p_booking_id uuid,p_provider text,p_reference text,p_amount bigint,p_currency text) returns void language plpgsql security definer set search_path=public as $$
declare b public.bookings; a public.payment_attempts;
begin
 select * into b from public.bookings where id=p_booking_id for update;
 select * into a from public.payment_attempts where id=p_attempt_id and booking_id=p_booking_id for update;
 if a.id is null or b.id is null or a.provider<>p_provider or a.provider_reference is distinct from p_reference or a.amount_minor<>p_amount or a.currency<>p_currency then raise exception 'Payment does not match checkout'; end if;
 if a.status='succeeded' and b.payment_status='paid' then return; end if;
 if a.status<>'pending' or b.status<>'approved' or b.archived_at is not null or b.quote_amount_minor is distinct from p_amount or b.quote_currency is distinct from p_currency or b.payment_status='paid' then raise exception 'Booking is not payable'; end if;
 update public.payment_attempts set status='succeeded',paid_at=now() where id=a.id;
 update public.bookings set payment_status='paid',paid_at=now() where id=b.id;
end $$;
revoke all on function public.record_verified_payment(uuid,uuid,text,text,bigint,text) from public,anon,authenticated;
grant execute on function public.record_verified_payment(uuid,uuid,text,text,bigint,text) to service_role;
