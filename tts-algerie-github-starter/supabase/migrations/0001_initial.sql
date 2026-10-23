-- Initial private schema. No credit-changing client policies.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text,
 created_at timestamptz not null default now()
);
create table if not exists public.generations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 text_input text not null check (char_length(text_input) between 1 and 20000),
 language text not null check (language in ('ar','fr','dz')),
 status text not null default 'pending' check (status in ('pending','ready','failed')),
 audio_path text,
 created_at timestamptz not null default now()
);
create index if not exists generations_user_created_idx on public.generations(user_id,created_at desc);
alter table public.profiles enable row level security;
alter table public.generations enable row level security;
create policy "profile_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "generation_select_own" on public.generations for select to authenticated using ((select auth.uid()) = user_id);
-- Writes must be implemented via verified backend workflows, not directly from clients.
