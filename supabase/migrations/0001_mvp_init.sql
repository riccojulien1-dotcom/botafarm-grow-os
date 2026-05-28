-- Botafarm Grow OS MVP V1 schema
-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  language text not null default 'fr' check (language in ('fr','en','de','es')),
  country text,
  subscription_type text not null default 'free' check (subscription_type in ('free','premium')),
  coaching_access boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.grow_rooms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  room_type text,
  dimensions text,
  lighting text,
  power_watts integer,
  substrate text,
  pot_size text,
  genetics text,
  irrigation text,
  extraction text,
  climate_notes text,
  plant_count integer,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  grow_room_id uuid not null references public.grow_rooms(id) on delete cascade,
  logged_at timestamptz not null default now(),
  temperature numeric(5,2),
  humidity numeric(5,2),
  vpd numeric(4,2),
  ec numeric(5,2),
  ph numeric(4,2),
  irrigation_ml integer,
  runoff_ec numeric(5,2),
  notes text
);

create table if not exists public.log_photos (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid not null references public.daily_logs(id) on delete cascade,
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grow_room_id uuid references public.grow_rooms(id) on delete cascade,
  title text not null,
  description text,
  due_at timestamptz,
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.grow_rooms enable row level security;
alter table public.daily_logs enable row level security;
alter table public.log_photos enable row level security;
alter table public.reminders enable row level security;

-- Profiles policies
create policy if not exists "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy if not exists "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy if not exists "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Grow rooms policies
create policy if not exists "grow_rooms_select_own"
  on public.grow_rooms for select
  using (auth.uid() = user_id);

create policy if not exists "grow_rooms_insert_own"
  on public.grow_rooms for insert
  with check (auth.uid() = user_id);

create policy if not exists "grow_rooms_update_own"
  on public.grow_rooms for update
  using (auth.uid() = user_id);

create policy if not exists "grow_rooms_delete_own"
  on public.grow_rooms for delete
  using (auth.uid() = user_id);

-- Daily logs policies
create policy if not exists "daily_logs_select_own"
  on public.daily_logs for select
  using (
    exists (
      select 1
      from public.grow_rooms gr
      where gr.id = daily_logs.grow_room_id
        and gr.user_id = auth.uid()
    )
  );

create policy if not exists "daily_logs_insert_own"
  on public.daily_logs for insert
  with check (
    exists (
      select 1
      from public.grow_rooms gr
      where gr.id = daily_logs.grow_room_id
        and gr.user_id = auth.uid()
    )
  );

create policy if not exists "daily_logs_update_own"
  on public.daily_logs for update
  using (
    exists (
      select 1
      from public.grow_rooms gr
      where gr.id = daily_logs.grow_room_id
        and gr.user_id = auth.uid()
    )
  );

create policy if not exists "daily_logs_delete_own"
  on public.daily_logs for delete
  using (
    exists (
      select 1
      from public.grow_rooms gr
      where gr.id = daily_logs.grow_room_id
        and gr.user_id = auth.uid()
    )
  );

-- Log photos policies
create policy if not exists "log_photos_select_own"
  on public.log_photos for select
  using (
    exists (
      select 1
      from public.daily_logs dl
      join public.grow_rooms gr on gr.id = dl.grow_room_id
      where dl.id = log_photos.daily_log_id
        and gr.user_id = auth.uid()
    )
  );

create policy if not exists "log_photos_insert_own"
  on public.log_photos for insert
  with check (
    exists (
      select 1
      from public.daily_logs dl
      join public.grow_rooms gr on gr.id = dl.grow_room_id
      where dl.id = log_photos.daily_log_id
        and gr.user_id = auth.uid()
    )
  );

create policy if not exists "log_photos_delete_own"
  on public.log_photos for delete
  using (
    exists (
      select 1
      from public.daily_logs dl
      join public.grow_rooms gr on gr.id = dl.grow_room_id
      where dl.id = log_photos.daily_log_id
        and gr.user_id = auth.uid()
    )
  );

-- Reminders policies
create policy if not exists "reminders_select_own"
  on public.reminders for select
  using (auth.uid() = user_id);

create policy if not exists "reminders_insert_own"
  on public.reminders for insert
  with check (auth.uid() = user_id);

create policy if not exists "reminders_update_own"
  on public.reminders for update
  using (auth.uid() = user_id);

create policy if not exists "reminders_delete_own"
  on public.reminders for delete
  using (auth.uid() = user_id);
