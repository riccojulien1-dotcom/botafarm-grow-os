-- Sprint 5: crop cycle tracking on grow_rooms
-- Run in Supabase SQL Editor (production + local) before using cycle fields in the app.

alter table public.grow_rooms
  add column if not exists cycle_start_date date;

alter table public.grow_rooms
  add column if not exists target_cycle_days integer;

alter table public.grow_rooms
  drop constraint if exists grow_rooms_target_cycle_days_check;

alter table public.grow_rooms
  add constraint grow_rooms_target_cycle_days_check
  check (target_cycle_days is null or target_cycle_days > 0);
