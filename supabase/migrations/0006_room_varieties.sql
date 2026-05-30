-- Sprint 6: multi-variety tracking per grow room
-- Run in Supabase SQL Editor (production + local) before using varieties in the app.

create table if not exists public.room_varieties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grow_room_id uuid not null references public.grow_rooms(id) on delete cascade,
  name text not null,
  genetics text,
  plant_count integer,
  flowering_duration_days integer,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists room_varieties_grow_room_id_idx
  on public.room_varieties (grow_room_id);

create index if not exists room_varieties_user_id_idx
  on public.room_varieties (user_id);

alter table public.room_varieties enable row level security;

alter table public.room_varieties
  drop constraint if exists room_varieties_plant_count_check;

alter table public.room_varieties
  add constraint room_varieties_plant_count_check
  check (plant_count is null or plant_count >= 0);

alter table public.room_varieties
  drop constraint if exists room_varieties_flowering_duration_days_check;

alter table public.room_varieties
  add constraint room_varieties_flowering_duration_days_check
  check (flowering_duration_days is null or flowering_duration_days > 0);

create policy if not exists "room_varieties_select_own"
  on public.room_varieties for select
  using (auth.uid() = user_id);

create policy if not exists "room_varieties_insert_own"
  on public.room_varieties for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.grow_rooms gr
      where gr.id = grow_room_id
        and gr.user_id = auth.uid()
    )
  );

create policy if not exists "room_varieties_update_own"
  on public.room_varieties for update
  using (auth.uid() = user_id);

create policy if not exists "room_varieties_delete_own"
  on public.room_varieties for delete
  using (auth.uid() = user_id);
