-- Botafarm Grow OS: create daily_logs table (full setup)
-- Prerequisite: public.grow_rooms must already exist.
-- Run this entire script in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grow_room_id uuid not null references public.grow_rooms(id) on delete cascade,
  log_date date not null default current_date,
  logged_at timestamptz not null default now(),
  temperature numeric(5, 2),
  humidity numeric(5, 2),
  vpd numeric(5, 2),
  ec numeric(5, 2),
  ph numeric(4, 2),
  irrigation_volume numeric(10, 2),
  dryback_percent numeric(5, 2),
  notes text
);

alter table public.daily_logs enable row level security;

drop policy if exists "daily_logs_select_own" on public.daily_logs;
drop policy if exists "daily_logs_insert_own" on public.daily_logs;
drop policy if exists "daily_logs_update_own" on public.daily_logs;
drop policy if exists "daily_logs_delete_own" on public.daily_logs;

create policy "daily_logs_select_own"
  on public.daily_logs
  for select
  using (user_id = auth.uid());

create policy "daily_logs_insert_own"
  on public.daily_logs
  for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.grow_rooms gr
      where gr.id = daily_logs.grow_room_id
        and gr.user_id = auth.uid()
    )
  );

create policy "daily_logs_update_own"
  on public.daily_logs
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "daily_logs_delete_own"
  on public.daily_logs
  for delete
  using (user_id = auth.uid());

create index if not exists daily_logs_grow_room_id_idx
  on public.daily_logs (grow_room_id);

create index if not exists daily_logs_user_id_idx
  on public.daily_logs (user_id);

create index if not exists daily_logs_room_date_idx
  on public.daily_logs (grow_room_id, log_date desc);
