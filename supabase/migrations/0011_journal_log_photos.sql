-- Journal photo support (idempotent for projects that skipped 0001/0002)

create table if not exists public.log_photos (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid not null references public.daily_logs(id) on delete cascade,
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.log_photos enable row level security;

drop policy if exists "log_photos_select_own" on public.log_photos;
create policy "log_photos_select_own"
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

drop policy if exists "log_photos_insert_own" on public.log_photos;
create policy "log_photos_insert_own"
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

drop policy if exists "log_photos_delete_own" on public.log_photos;
create policy "log_photos_delete_own"
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

insert into storage.buckets (id, name, public)
values ('log-photos', 'log-photos', false)
on conflict (id) do nothing;

drop policy if exists "log_photos_select_own" on storage.objects;
create policy "log_photos_select_own"
on storage.objects for select
using (
  bucket_id = 'log-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "log_photos_insert_own" on storage.objects;
create policy "log_photos_insert_own"
on storage.objects for insert
with check (
  bucket_id = 'log-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "log_photos_delete_own" on storage.objects;
create policy "log_photos_delete_own"
on storage.objects for delete
using (
  bucket_id = 'log-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
