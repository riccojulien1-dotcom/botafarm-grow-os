-- Storage bucket for daily log photos
insert into storage.buckets (id, name, public)
values ('log-photos', 'log-photos', false)
on conflict (id) do nothing;

-- Users can read only their own files through folder prefix: <user_id>/...
create policy if not exists "log_photos_select_own"
on storage.objects for select
using (
  bucket_id = 'log-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy if not exists "log_photos_insert_own"
on storage.objects for insert
with check (
  bucket_id = 'log-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy if not exists "log_photos_delete_own"
on storage.objects for delete
using (
  bucket_id = 'log-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
