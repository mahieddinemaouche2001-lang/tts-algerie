-- =====================================================================
-- VOIX DZ — 0002_generation_jobs
-- STATUT : PROPOSITION. NE PAS APPLIQUER SANS VALIDATION ÉCRITE.
-- Aucune donnée existante n'est supprimée. Réexécutable sans danger.
--
-- Objet : suivre les demandes de synthèse traitées de façon asynchrone
-- (mode démonstration aujourd'hui, fournisseur réel plus tard).
--
-- À appliquer uniquement après :
--   1. comparaison avec le schéma réel de la base,
--   2. sauvegarde,
--   3. test sur un projet Supabase de préproduction.
-- =====================================================================

begin;

create table if not exists public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  generation_id uuid references public.generations(id) on delete set null,

  provider text not null default 'gemini',
  provider_job_id text,
  idempotency_key text not null,

  status text not null default 'queued'
    check (status in ('queued', 'running', 'completed', 'failed', 'canceled')),
  mode text not null default 'demo'
    check (mode in ('demo', 'live')),

  text_input text not null
    check (char_length(text_input) between 1 and 20000),
  language text not null
    check (language in ('ar', 'fr', 'dz')),

  attempts integer not null default 0
    check (attempts >= 0),
  error_code text,
  audio_path text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,

  constraint generation_jobs_user_idempotency_key
    unique (user_id, idempotency_key)
);

create index if not exists generation_jobs_user_created_idx
  on public.generation_jobs (user_id, created_at desc);

create index if not exists generation_jobs_status_idx
  on public.generation_jobs (status, created_at);

alter table public.generation_jobs enable row level security;

-- Lecture seule pour le propriétaire.
drop policy if exists "job_select_own" on public.generation_jobs;
create policy "job_select_own"
  on public.generation_jobs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Aucune politique d'écriture côté client :
-- les insertions et transitions passent par le serveur vérifié.

create or replace function public.touch_generation_jobs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists generation_jobs_touch_updated_at on public.generation_jobs;
create trigger generation_jobs_touch_updated_at
  before update on public.generation_jobs
  for each row
  execute function public.touch_generation_jobs_updated_at();

commit;
