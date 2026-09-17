-- Adds sport template + custom graphic support to an existing Campus Pulse
-- project (one that already ran the original supabase/schema.sql).

alter table public.events
  add column if not exists sport_kind text check (
    sport_kind in ('football', 'cricket', 'tennis', 'basketball', 'badminton', 'volleyball', 'other')
  ),
  add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read event images" on storage.objects;
create policy "Public can read event images"
  on storage.objects
  for select
  using (bucket_id = 'event-images');

drop policy if exists "Public can upload event images" on storage.objects;
create policy "Public can upload event images"
  on storage.objects
  for insert
  with check (bucket_id = 'event-images');
