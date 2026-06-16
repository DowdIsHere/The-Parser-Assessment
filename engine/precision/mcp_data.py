"""
Shared data loader for the Precision track.

Pulls Jeff Sackmann's Match Charting Project (MCP) files on demand and caches
them under engine/data/mcp/ (gitignored). The MCP repo is the only Sackmann
repo reachable from the web sandbox; the ATP/WTA results repos 404 here, so all
Precision analysis is built on charting data.

Source: https://github.com/JeffSackmann/tennis_MatchChartingProject  (master)
"""
import csv
import os
import urllib.request

BASE = "https://raw.githubusercontent.com/JeffSackmann/tennis_MatchChartingProject/master/"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "mcp")

FILES = {
    "m_overview": "charting-m-stats-Overview.csv",
    "m_rally":    "charting-m-stats-Rally.csv",
    "m_matches":  "charting-m-matches.csv",
    "w_matches":  "charting-w-matches.csv",
    "m_points":   "charting-m-points-2020s.csv",
    "w_points":   "charting-w-points-2020s.csv",
}


def ensure(key):
    """Download FILES[key] to the cache if missing; return the local path."""
    os.makedirs(DATA_DIR, exist_ok=True)
    path = os.path.join(DATA_DIR, FILES[key])
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        url = BASE + FILES[key]
        print(f"  downloading {FILES[key]} ...")
        last = None
        for attempt in range(4):
            try:
                urllib.request.urlretrieve(url, path)
                break
            except Exception as e:  # network hiccup -> simple retry
                last = e
        else:
            raise RuntimeError(f"could not download {url}: {last}")
    return path


def load_match_meta():
    """match_id -> dict(p1, p2, surface, best_of, round) for men + women."""
    meta = {}
    for key in ("m_matches", "w_matches"):
        with open(ensure(key), encoding="utf-8", errors="replace") as f:
            for row in csv.DictReader(f):
                meta[row["match_id"]] = {
                    "p1": row["Player 1"],
                    "p2": row["Player 2"],
                    "surface": row.get("Surface", ""),
                    "best_of": _int(row.get("Best of", "3"), 3),
                    "round": row.get("Round", ""),
                }
    return meta


def _int(v, default=0):
    try:
        return int(str(v).strip())
    except Exception:
        return default


def iter_points(tour):
    """Yield point rows (as dicts) for 'm' or 'w'."""
    key = "m_points" if tour == "m" else "w_points"
    with open(ensure(key), encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            yield row
