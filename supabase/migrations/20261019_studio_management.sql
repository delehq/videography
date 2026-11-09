-- Apply after the booking/payment schema. Content and private records use separate rows.
create table if not exists public.studio_content(id text primary key check(id in ('draft','published','operations')),content jsonb not null,revision bigint not null default 1,updated_at timestamptz not null default now());
create table if not exists public.studio_content_history(id uuid primary key default gen_random_uuid(),content jsonb not null,actor uuid,created_at timestamptz not null default now());
alter table public.studio_content enable row level security;
alter table public.studio_content_history enable row level security;
revoke all on public.studio_content,public.studio_content_history from anon,authenticated;
grant all on public.studio_content,public.studio_content_history to service_role;
create or replace function public.save_studio_content(p_action text,p_content jsonb,p_revision bigint,p_actor uuid) returns bigint language plpgsql security definer set search_path=public as $$
declare current_revision bigint; target text; next_revision bigint;
begin
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
-- Uploads are limited to studio admins. The bucket is public because these are public portfolio assets.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('portfolio','portfolio',true,52428800,array['image/jpeg','image/png','image/webp','video/mp4','video/webm']) on conflict(id) do nothing;
create policy "Studio uploads" on storage.objects for insert to authenticated with check(bucket_id='portfolio' and exists(select 1 from public.studio_admins where user_id=auth.uid()));
create policy "Studio removes assets" on storage.objects for delete to authenticated using(bucket_id='portfolio' and exists(select 1 from public.studio_admins where user_id=auth.uid()));
