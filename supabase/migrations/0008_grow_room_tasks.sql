-- Sprint 12: grow room tasks & workflow
-- Run in Supabase SQL Editor (production + local) before using tasks in the app.

create table if not exists public.grow_room_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grow_room_id uuid not null references public.grow_rooms(id) on delete cascade,
  title text not null,
  description text,
  due_date date not null,
  completed boolean not null default false,
  completed_at timestamptz,
  priority text not null default 'medium',
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists grow_room_tasks_grow_room_id_idx
  on public.grow_room_tasks (grow_room_id);

create index if not exists grow_room_tasks_user_id_idx
  on public.grow_room_tasks (user_id);

create index if not exists grow_room_tasks_due_date_idx
  on public.grow_room_tasks (grow_room_id, due_date);

alter table public.grow_room_tasks enable row level security;

alter table public.grow_room_tasks
  drop constraint if exists grow_room_tasks_priority_check;

alter table public.grow_room_tasks
  add constraint grow_room_tasks_priority_check
  check (priority in ('low', 'medium', 'high'));

alter table public.grow_room_tasks
  drop constraint if exists grow_room_tasks_category_check;

alter table public.grow_room_tasks
  add constraint grow_room_tasks_category_check
  check (
    category in (
      'Irrigation',
      'Environment',
      'Nutrition',
      'Plant Work',
      'Maintenance',
      'Harvest',
      'Drying',
      'Curing'
    )
  );

drop policy if exists "grow_room_tasks_select_own" on public.grow_room_tasks;
drop policy if exists "grow_room_tasks_insert_own" on public.grow_room_tasks;
drop policy if exists "grow_room_tasks_update_own" on public.grow_room_tasks;
drop policy if exists "grow_room_tasks_delete_own" on public.grow_room_tasks;

create policy "grow_room_tasks_select_own"
  on public.grow_room_tasks for select
  using (auth.uid() = user_id);

create policy "grow_room_tasks_insert_own"
  on public.grow_room_tasks for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.grow_rooms gr
      where gr.id = grow_room_id
        and gr.user_id = auth.uid()
    )
  );

create policy "grow_room_tasks_update_own"
  on public.grow_room_tasks for update
  using (auth.uid() = user_id);

create policy "grow_room_tasks_delete_own"
  on public.grow_room_tasks for delete
  using (auth.uid() = user_id);
