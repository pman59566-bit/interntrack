-- InternTrack database setup
-- Paste all of this into Supabase → SQL Editor → New query, then click Run.
-- It is safe to run more than once.

-- 1. The table: one row per internship application
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  -- who owns the row: filled in automatically with the logged-in user's id
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- what the user types, e.g. "Summer Analyst, investment bank"
  title text not null check (char_length(title) between 1 and 200),
  status text not null default 'Applied' check (status in ('Applied', 'Interview', 'Offer', 'Rejected')),
  created_at timestamptz not null default now()
);

create index if not exists applications_user_id_idx on public.applications (user_id);

-- 2. Row Level Security: each user can only see and change their own rows
alter table public.applications enable row level security;

drop policy if exists "Users can read their own applications" on public.applications;
create policy "Users can read their own applications"
  on public.applications for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add their own applications" on public.applications;
create policy "Users can add their own applications"
  on public.applications for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own applications" on public.applications;
create policy "Users can update their own applications"
  on public.applications for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own applications" on public.applications;
create policy "Users can delete their own applications"
  on public.applications for delete to authenticated
  using ((select auth.uid()) = user_id);

-- 3. Permissions: logged-in users may use the table (RLS still limits them to
--    their own rows); visitors who aren't logged in get nothing at all
grant select, insert, update, delete on public.applications to authenticated;
revoke all on public.applications from anon;
