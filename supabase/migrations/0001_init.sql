-- Mindspan schema. Row level security is on everywhere: a user can only ever
-- read and write their own rows.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  age smallint check (age between 18 and 90),
  concerns text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  played_at timestamptz not null default now(),
  games jsonb not null default '[]',
  -- One line, and you can't backfill it (PRD §9).
  device_model text,
  os_version text,
  app_version text
);

create table if not exists public.checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  taken_at timestamptz not null default now(),
  mind_age smallint not null,
  skills jsonb not null,
  mean_rt_ms real,
  scoring_version text not null default 'ms-scoring-2',
  device_model text,
  os_version text,
  app_version text
);

create index if not exists sessions_user_played_idx on public.sessions (user_id, played_at desc);
create index if not exists checks_user_taken_idx on public.checks (user_id, taken_at desc);

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.checks   enable row level security;

create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile write"  on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create policy "own sessions read"  on public.sessions for select using (auth.uid() = user_id);
create policy "own sessions write" on public.sessions for insert with check (auth.uid() = user_id);

create policy "own checks read"    on public.checks for select using (auth.uid() = user_id);
create policy "own checks write"   on public.checks for insert with check (auth.uid() = user_id);

-- Give every new auth user a profile row so the app never has to upsert.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
