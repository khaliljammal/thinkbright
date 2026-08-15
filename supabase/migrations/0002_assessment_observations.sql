-- Raw assessment observations remain separate from user-facing domain scores so
-- future normalization can change without losing the original measurements.
create table if not exists public.assessment_observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  check_id uuid not null references public.checks on delete cascade,
  game_id text not null,
  mode text not null check (mode in ('assessment', 'training')),
  level_reached smallint,
  trials jsonb not null default '[]',
  metrics jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists assessment_observations_check_idx
  on public.assessment_observations (check_id, game_id);

alter table public.assessment_observations enable row level security;

create policy "own observations read" on public.assessment_observations
  for select using (auth.uid() = user_id);
create policy "own observations write" on public.assessment_observations
  for insert with check (auth.uid() = user_id);
