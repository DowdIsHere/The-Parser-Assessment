"""
engine/load_matches_supabase.py — load the Sackmann match feed into Supabase.

Dependency-free: talks to Supabase's PostgREST endpoint with stdlib urllib, so it
needs no extra packages. Upserts on the (tourney_id, match_num) natural key, so
re-running tops the table up instead of duplicating.

Prereqs:
  1. Apply engine/sql/schema.sql to the project (SQL editor or apply_migration).
  2. Export credentials (the service_role key bypasses RLS — server-side only):
        export SUPABASE_URL=https://<project>.supabase.co
        export SUPABASE_SERVICE_ROLE_KEY=<service_role key>

Usage:
  python3 engine/load_matches_supabase.py            # default seasons
  python3 engine/load_matches_supabase.py 2023 2024  # specific seasons
"""

import json
import os
import sys
import urllib.request
from fade_curve import YEARS, ensure_data, _local_path  # reuse the cached downloader

BATCH = 500
INT_COLS = {
    "match_num", "best_of", "minutes", "winner_id", "winner_rank",
    "loser_id", "loser_rank",
    "w_ace", "w_df", "w_svpt", "w_1stin", "w_1stwon", "w_2ndwon", "w_bpsaved", "w_bpfaced",
    "l_ace", "l_df", "l_svpt", "l_1stin", "l_1stwon", "l_2ndwon", "l_bpsaved", "l_bpfaced",
}
# Sackmann CSV column  ->  matches table column
COLMAP = {
    "tourney_id": "tourney_id", "tourney_name": "tourney_name", "surface": "surface",
    "tourney_level": "tourney_level", "match_num": "match_num", "best_of": "best_of",
    "round": "round", "minutes": "minutes",
    "winner_name": "winner_name", "winner_id": "winner_id", "winner_rank": "winner_rank",
    "loser_name": "loser_name", "loser_id": "loser_id", "loser_rank": "loser_rank",
    "score": "score",
    "w_ace": "w_ace", "w_df": "w_df", "w_svpt": "w_svpt", "w_1stIn": "w_1stin",
    "w_1stWon": "w_1stwon", "w_2ndWon": "w_2ndwon", "w_bpSaved": "w_bpsaved", "w_bpFaced": "w_bpfaced",
    "l_ace": "l_ace", "l_df": "l_df", "l_svpt": "l_svpt", "l_1stIn": "l_1stin",
    "l_1stWon": "l_1stwon", "l_2ndWon": "l_2ndwon", "l_bpSaved": "l_bpsaved", "l_bpFaced": "l_bpfaced",
}


def _coerce(col, val):
    val = (val or "").strip()
    if val == "":
        return None
    if col in INT_COLS:
        try:
            return int(float(val))
        except ValueError:
            return None
    return val


def _row(raw):
    out = {}
    for src, dst in COLMAP.items():
        out[dst] = _coerce(dst, raw.get(src, ""))
    d = (raw.get("tourney_date") or "").strip()
    out["tourney_date"] = f"{d[:4]}-{d[4:6]}-{d[6:8]}" if len(d) == 8 else None
    return out


def _post(url, key, rows):
    body = json.dumps(rows).encode()
    req = urllib.request.Request(
        f"{url}/rest/v1/matches?on_conflict=tourney_id,match_num",
        data=body, method="POST",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
    )
    with urllib.request.urlopen(req) as r:
        return r.status


def main(years):
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first (see module docstring).")

    import csv
    ensure_data(years)
    total = 0
    for y in years:
        with open(_local_path(y)) as f:
            rows = [_row(r) for r in csv.DictReader(f) if r.get("winner_name") and r.get("loser_name")]
        for i in range(0, len(rows), BATCH):
            _post(url, key, rows[i:i + BATCH])
        total += len(rows)
        print(f"  {y}: upserted {len(rows)} matches")
    print(f"done — {total} matches loaded into Supabase.")


if __name__ == "__main__":
    yrs = [int(a) for a in sys.argv[1:]] or list(YEARS)
    main(yrs)
