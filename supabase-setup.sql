-- Ten Spot: global score table. Paste this whole file into Supabase > SQL Editor > New query, then Run.
-- Players can add one score (0–10) per list, but nobody can read individual rows:
-- the game only gets counts per score through score_dist().

create table if not exists public.scores (
  id bigint generated always as identity primary key,
  puzzle_no text not null check (char_length(puzzle_no) between 1 and 8),
  player_id uuid not null,
  score int not null check (score between 0 and 10),
  created_at timestamptz not null default now(),
  unique (puzzle_no, player_id)
);

alter table public.scores enable row level security;

drop policy if exists "anyone can add a score" on public.scores;
create policy "anyone can add a score" on public.scores
  for insert to anon with check (true);

create or replace function public.score_dist(p_no text)
returns table (score int, n bigint)
language sql stable security definer set search_path = public
as $$
  select s.score, count(*) from public.scores s
  where s.puzzle_no = p_no
  group by s.score order by s.score
$$;

revoke all on function public.score_dist(text) from public;
grant execute on function public.score_dist(text) to anon;
