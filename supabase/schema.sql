-- Campus Pulse — events table + storage for event graphics
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)
-- for a fresh project. For a project that already has the original
-- `events` table, use supabase/migrations/0002_event_graphics.sql instead.

create extension if not exists "pgcrypto";

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('sports', 'society')),
  location text not null,
  posted_by text not null,
  start_time timestamptz not null,
  expires_at timestamptz,
  description text,
  sport_kind text check (
    sport_kind in ('football', 'cricket', 'tennis', 'basketball', 'badminton', 'volleyball', 'other')
  ),
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists events_start_time_idx on public.events (start_time);

alter table public.events enable row level security;

-- Public read access — anyone can see the feed.
create policy "Public can read events"
  on public.events
  for select
  using (true);

-- Public insert access — the admin form gates posting with a shared
-- passcode checked client-side (kept simple on purpose for a live demo).
-- This is NOT real auth: anyone with the anon key could insert directly.
-- Good enough for a campus demo; swap for a Supabase Edge Function that
-- verifies the passcode server-side before going further than a demo.
create policy "Public can insert events"
  on public.events
  for insert
  with check (true);

-- Enable realtime on this table (Database > Replication in the dashboard,
-- or run this):
alter publication supabase_realtime add table public.events;

-- Storage bucket for organizer-uploaded event graphics. Public bucket so
-- uploaded images are viewable via a plain public URL on the feed.
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

create policy "Public can read event images"
  on storage.objects
  for select
  using (bucket_id = 'event-images');

-- Same trust model as the events table insert policy above — gated by the
-- passcode client-side, not real per-user auth.
create policy "Public can upload event images"
  on storage.objects
  for insert
  with check (bucket_id = 'event-images');
