# Ten Spot

A daily top-10 list game from [Play 2D Games](https://play2dgames.com/). Name as many of the top 10 as you can before your 5 misses run out. Live at https://tenspot.play2dgames.com/.

## Files

- `index.html` – the whole game (layout, styles and code).
- `puzzles.json` – the daily lists. The newest list whose `date` has arrived (in the player's time zone) is today's.
- `consent.js` – the shared cookie banner (keep it in sync with the copy in the home site and Relic).
- `fonts.css`, `fonts/` – self-hosted pixel fonts.
- `supabase-setup.sql` – creates the scores table in this game's own Supabase project.
- `CNAME` – the custom domain. Don't delete it.

## Adding a list

Copy an entry in `puzzles.json`, give it the next `date` and `no`, and fill in:

- `kind`: `country` (checks spelling against every country and suggests names), `person` (a unique surname is enough), or `film` / anything else (name or listed aliases).
- `answers`: exactly 10, each with `rank`, `name`, `value` and optional `aliases` (other accepted spellings). Tied ranks share a number and show as "6=".
- `close`: #11–13, so near misses get a "so close" message (still a miss).
- `free`: guesses that get a note and cost nothing, e.g. `{"match": ["bush"], "note": "Which George Bush? …"}`. Add `"miss": true` to make the note still cost a miss.
- `source`: name and link for where the ranking comes from. Only use lists with a public source.

Check the file at jsonlint.com before pushing.

## Testing a future list

Run `python3 -m http.server 8000` in this folder, then open http://localhost:8000/?date=2026-11-03. The `?date=` override only works on localhost.

## Scores database

1. Create a new Supabase project (free) and open SQL Editor → New query. Paste `supabase-setup.sql` and run it.
2. In Project Settings → API, copy the Project URL and the `anon` public key into `SUPABASE_URL` and `SUPABASE_KEY` in `index.html`.

Players can add one score per list but can't read anyone's rows; the game only gets counts per score.
