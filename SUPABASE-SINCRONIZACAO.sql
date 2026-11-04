-- Linkki v0.2 — execute no SQL Editor do projeto Supabase.
-- Cada usuario autenticado pode ler e escrever APENAS seus dados.
create table if not exists public.linkki_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.linkki_user_data enable row level security;

revoke all on table public.linkki_user_data from anon;
grant select, insert, update, delete on table public.linkki_user_data to authenticated;

drop policy if exists "linkki_select_own" on public.linkki_user_data;
create policy "linkki_select_own" on public.linkki_user_data
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "linkki_insert_own" on public.linkki_user_data;
create policy "linkki_insert_own" on public.linkki_user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "linkki_update_own" on public.linkki_user_data;
create policy "linkki_update_own" on public.linkki_user_data
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "linkki_delete_own" on public.linkki_user_data;
create policy "linkki_delete_own" on public.linkki_user_data
  for delete to authenticated using ((select auth.uid()) = user_id);
