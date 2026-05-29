-- Sprint 4: add grow room lifecycle status
-- Run in Supabase SQL Editor (production + local) before using status in the app.

alter table public.grow_rooms
  add column if not exists status text;

update public.grow_rooms
set status = 'Vegetative'
where status is null;

alter table public.grow_rooms
  alter column status set default 'Vegetative',
  alter column status set not null;

alter table public.grow_rooms
  drop constraint if exists grow_rooms_status_check;

alter table public.grow_rooms
  add constraint grow_rooms_status_check
  check (
    status in (
      'Clone',
      'Mother',
      'Vegetative',
      'Pre-Flower',
      'Flower',
      'Drying',
      'Cure'
    )
  );
