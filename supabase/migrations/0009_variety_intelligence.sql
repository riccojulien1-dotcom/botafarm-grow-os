-- Sprint 15: variety intelligence (final)
-- Botafarm presets: no fake flowering days; all sensitivities medium
-- Run in Supabase SQL Editor before deploying Sprint 15 app code.

create table if not exists public.variety_presets (
  slug text primary key,
  name text not null,
  variety_type text not null default 'Hybrid',
  flowering_duration_days integer,
  harvest_window_start_days integer,
  harvest_window_end_days integer,
  stretch text not null default 'medium',
  ec_sensitivity text not null default 'medium',
  irrigation_sensitivity text not null default 'medium',
  genetics text,
  phenotype_notes text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.variety_presets
  drop constraint if exists variety_presets_variety_type_check;

alter table public.variety_presets
  add constraint variety_presets_variety_type_check
  check (variety_type in ('Indica', 'Sativa', 'Hybrid', 'CBD', 'Auto'));

alter table public.variety_presets
  drop constraint if exists variety_presets_stretch_check;

alter table public.variety_presets
  add constraint variety_presets_stretch_check
  check (stretch in ('low', 'medium', 'high'));

alter table public.variety_presets
  drop constraint if exists variety_presets_ec_sensitivity_check;

alter table public.variety_presets
  add constraint variety_presets_ec_sensitivity_check
  check (ec_sensitivity in ('low', 'medium', 'high'));

alter table public.variety_presets
  drop constraint if exists variety_presets_irrigation_sensitivity_check;

alter table public.variety_presets
  add constraint variety_presets_irrigation_sensitivity_check
  check (irrigation_sensitivity in ('low', 'medium', 'high'));

alter table public.variety_presets
  drop constraint if exists variety_presets_flowering_duration_days_check;

alter table public.variety_presets
  add constraint variety_presets_flowering_duration_days_check
  check (flowering_duration_days is null or flowering_duration_days > 0);

alter table public.variety_presets
  drop constraint if exists variety_presets_harvest_window_start_days_check;

alter table public.variety_presets
  add constraint variety_presets_harvest_window_start_days_check
  check (harvest_window_start_days is null or harvest_window_start_days > 0);

alter table public.variety_presets
  drop constraint if exists variety_presets_harvest_window_end_days_check;

alter table public.variety_presets
  add constraint variety_presets_harvest_window_end_days_check
  check (harvest_window_end_days is null or harvest_window_end_days > 0);

alter table public.variety_presets
  drop constraint if exists variety_presets_harvest_window_order_check;

alter table public.variety_presets
  add constraint variety_presets_harvest_window_order_check
  check (
    harvest_window_start_days is null
    or harvest_window_end_days is null
    or harvest_window_end_days >= harvest_window_start_days
  );

create unique index if not exists variety_presets_name_unique_idx
  on public.variety_presets (name);

alter table public.room_varieties
  add column if not exists preset_slug text references public.variety_presets (slug) on delete set null;

alter table public.room_varieties
  add column if not exists variety_type text not null default 'Hybrid';

alter table public.room_varieties
  add column if not exists harvest_window_start_days integer;

alter table public.room_varieties
  add column if not exists harvest_window_end_days integer;

alter table public.room_varieties
  add column if not exists stretch text not null default 'medium';

alter table public.room_varieties
  add column if not exists ec_sensitivity text not null default 'medium';

alter table public.room_varieties
  add column if not exists irrigation_sensitivity text not null default 'medium';

alter table public.room_varieties
  add column if not exists phenotype_notes text;

alter table public.room_varieties
  add column if not exists updated_at timestamptz not null default now();

alter table public.room_varieties
  drop constraint if exists room_varieties_variety_type_check;

alter table public.room_varieties
  add constraint room_varieties_variety_type_check
  check (variety_type in ('Indica', 'Sativa', 'Hybrid', 'CBD', 'Auto'));

alter table public.room_varieties
  drop constraint if exists room_varieties_stretch_check;

alter table public.room_varieties
  add constraint room_varieties_stretch_check
  check (stretch in ('low', 'medium', 'high'));

alter table public.room_varieties
  drop constraint if exists room_varieties_ec_sensitivity_check;

alter table public.room_varieties
  add constraint room_varieties_ec_sensitivity_check
  check (ec_sensitivity in ('low', 'medium', 'high'));

alter table public.room_varieties
  drop constraint if exists room_varieties_irrigation_sensitivity_check;

alter table public.room_varieties
  add constraint room_varieties_irrigation_sensitivity_check
  check (irrigation_sensitivity in ('low', 'medium', 'high'));

alter table public.room_varieties
  drop constraint if exists room_varieties_harvest_window_start_days_check;

alter table public.room_varieties
  add constraint room_varieties_harvest_window_start_days_check
  check (harvest_window_start_days is null or harvest_window_start_days > 0);

alter table public.room_varieties
  drop constraint if exists room_varieties_harvest_window_end_days_check;

alter table public.room_varieties
  add constraint room_varieties_harvest_window_end_days_check
  check (harvest_window_end_days is null or harvest_window_end_days > 0);

alter table public.room_varieties
  drop constraint if exists room_varieties_harvest_window_order_check;

alter table public.room_varieties
  add constraint room_varieties_harvest_window_order_check
  check (
    harvest_window_start_days is null
    or harvest_window_end_days is null
    or harvest_window_end_days >= harvest_window_start_days
  );

create index if not exists room_varieties_preset_slug_idx
  on public.room_varieties (preset_slug);

create index if not exists room_varieties_grow_room_name_idx
  on public.room_varieties (grow_room_id, name);

update public.room_varieties
set
  variety_type = coalesce(variety_type, 'Hybrid'),
  stretch = coalesce(stretch, 'medium'),
  ec_sensitivity = coalesce(ec_sensitivity, 'medium'),
  irrigation_sensitivity = coalesce(irrigation_sensitivity, 'medium'),
  updated_at = coalesce(updated_at, created_at)
where true;

alter table public.variety_presets enable row level security;

drop policy if exists "variety_presets_select_authenticated" on public.variety_presets;

create policy "variety_presets_select_authenticated"
  on public.variety_presets for select
  to authenticated
  using (true);

insert into public.variety_presets (
  slug,
  name,
  variety_type,
  flowering_duration_days,
  harvest_window_start_days,
  harvest_window_end_days,
  stretch,
  ec_sensitivity,
  irrigation_sensitivity,
  genetics,
  phenotype_notes,
  notes
)
values
  (
    'haters-killah',
    'Haters Killah',
    'Hybrid',
    null,
    null,
    null,
    'medium',
    'medium',
    'medium',
    null,
    'Phenotype varies by plant — document structure, stretch, and ripening for this run.',
    'Botafarm template. Set harvest window, flowering target, and sensitivities for this grow.'
  ),
  (
    'true-angel',
    'True Angel',
    'Hybrid',
    null,
    null,
    null,
    'medium',
    'medium',
    'medium',
    null,
    'Phenotype varies by plant — document structure, stretch, and ripening for this run.',
    'Botafarm template. Set harvest window, flowering target, and sensitivities for this grow.'
  ),
  (
    'rs11',
    'RS11',
    'Hybrid',
    null,
    null,
    null,
    'medium',
    'medium',
    'medium',
    null,
    'Phenotype varies by plant — document structure, stretch, and ripening for this run.',
    'Botafarm template. Set harvest window, flowering target, and sensitivities for this grow.'
  ),
  (
    'cereal-milk-s1',
    'Cereal Milk S1',
    'Hybrid',
    null,
    null,
    null,
    'medium',
    'medium',
    'medium',
    null,
    'Phenotype varies by plant — document structure, stretch, and ripening for this run.',
    'Botafarm template. Set harvest window, flowering target, and sensitivities for this grow.'
  ),
  (
    'zushi-s1',
    'Zushi S1',
    'Hybrid',
    null,
    null,
    null,
    'medium',
    'medium',
    'medium',
    null,
    'Phenotype varies by plant — document structure, stretch, and ripening for this run.',
    'Botafarm template. Set harvest window, flowering target, and sensitivities for this grow.'
  )
on conflict (slug) do update set
  name = excluded.name,
  variety_type = excluded.variety_type,
  stretch = excluded.stretch,
  ec_sensitivity = excluded.ec_sensitivity,
  irrigation_sensitivity = excluded.irrigation_sensitivity,
  genetics = excluded.genetics,
  phenotype_notes = excluded.phenotype_notes,
  notes = excluded.notes,
  updated_at = now();
