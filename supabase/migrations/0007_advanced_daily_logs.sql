-- Sprint 7: advanced daily journal fields
-- Run in Supabase SQL Editor (production + local) before using new fields in the app.

alter table public.daily_logs
  add column if not exists ppfd numeric(8, 2);

alter table public.daily_logs
  add column if not exists dli numeric(8, 2);

alter table public.daily_logs
  add column if not exists ec_in numeric(5, 2);

alter table public.daily_logs
  add column if not exists ph_in numeric(4, 2);

alter table public.daily_logs
  add column if not exists ec_runoff numeric(5, 2);

alter table public.daily_logs
  add column if not exists ph_runoff numeric(4, 2);

alter table public.daily_logs
  add column if not exists irrigation_count integer;

alter table public.daily_logs
  add column if not exists irrigation_volume_per_event numeric(10, 2);

alter table public.daily_logs
  add column if not exists runoff_percent numeric(5, 2);

alter table public.daily_logs
  add column if not exists plant_height_cm numeric(6, 2);

alter table public.daily_logs
  add column if not exists stretch_percent numeric(5, 2);

update public.daily_logs
set ec_in = ec
where ec_in is null
  and ec is not null;

update public.daily_logs
set ph_in = ph
where ph_in is null
  and ph is not null;

update public.daily_logs
set irrigation_volume_per_event = irrigation_volume
where irrigation_volume_per_event is null
  and irrigation_volume is not null;
