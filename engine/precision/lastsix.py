"""
LAST-SIX durability trajectory (observation build — NOT wired into FIT).

Reconstructs every charted match's final set tally + winner from the last point,
tags BO3/BO5 and whether it went to a decider, orders per player by date, and
exposes the last-3 BO3 deciders and last-3 BO5 deciders as a SEQUENCE (slope),
plus the recent match tail so cross-format carryover is visible.

Reads Sackmann charting (frozen May 21 2026). Caches the per-match reconstruction
to engine/data/mcp/_match_tally.csv so re-runs are instant.
"""
import sys, csv, os, collections
sys.path.insert(0, os.path.dirname(__file__))
import mcp_data

CACHE = os.path.join(os.path.dirname(__file__), "..", "data", "mcp", "_match_tally.csv")


def build_cache():
    meta = mcp_data.load_match_meta()
    last = {}
    for row in mcp_data.iter_points("m"):
        mid = row["match_id"]
        try:
            s1 = int(row["Set1"]); s2 = int(row["Set2"])
        except Exception:
            continue
        last[mid] = (s1, s2, row.get("PtWinner", ""), row.get("Notes", ""))
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["match_id", "date", "bo", "p1", "p2", "winner", "decider", "fs1", "fs2", "surface"])
        for mid, (s1, s2, pw, notes) in last.items():
            m = meta.get(mid)
            if not m or pw not in ("1", "2"):
                continue
            bo = m["best_of"]; p1, p2 = m["p1"], m["p2"]
            fs1 = s1 + (1 if pw == "1" else 0)
            fs2 = s2 + (1 if pw == "2" else 0)
            winner = p1 if pw == "1" else p2
            went = (bo == 3 and s1 == 1 and s2 == 1) or (bo == 5 and s1 == 2 and s2 == 2)
            w.writerow([mid, mid[:8], bo, p1, p2, winner, int(went), fs1, fs2, m["surface"]])


def load():
    matches = collections.defaultdict(list)
    with open(CACHE) as f:
        for r in csv.DictReader(f):
            for who in (r["p1"], r["p2"]):
                mine = who == r["p1"]
                matches[who].append(dict(
                    date=r["date"], bo=int(r["bo"]),
                    won=(who == r["winner"]), decider=(r["decider"] == "1"),
                    setscore=(f'{r["fs1"]}-{r["fs2"]}' if mine else f'{r["fs2"]}-{r["fs1"]}'),
                    opp=(r["p2"] if mine else r["p1"]), surf=r["surface"]))
    return matches


def _norm(s):
    return set(s.lower().replace("-", " ").replace(".", "").split())


def find(matches, name):
    want = _norm(name)
    for k in matches:
        if _norm(k) == want:
            return k
    for k in matches:
        kk = _norm(k)
        if want <= kk or kk <= want:
            return k
    return None


def show(matches, name):
    k = find(matches, name)
    if not k:
        print(f"{name}: not found"); return
    ms = sorted(matches[k], key=lambda x: x["date"])
    print(f"\n===== {k}  ({len(ms)} charted matches in window) =====")
    print("recent sequence (oldest→newest), * = went to a decider:")
    for x in ms[-14:]:
        d = x["date"]; ds = f"{d[:4]}-{d[4:6]}-{d[6:]}"
        print(f"  {ds}  BO{x['bo']}  {'W' if x['won'] else 'L'}  {x['setscore']:>4} "
              f"{'*' if x['decider'] else ' '}  vs {x['opp']}")
    for bo in (3, 5):
        dec = [x for x in ms if x["decider"] and x["bo"] == bo]
        seq = " ".join(("W" if x["won"] else "L") for x in dec[-3:])
        rec = f"{sum(1 for x in dec if x['won'])}-{sum(1 for x in dec if not x['won'])}"
        print(f"  last-3 BO{bo} deciders: [{seq or '—'}]   (in-window {rec}, n={len(dec)})")


if __name__ == "__main__":
    if not os.path.exists(CACHE) or "--rebuild" in sys.argv:
        print("building match tally cache ...", flush=True)
        build_cache()
        print("done.", flush=True)
    matches = load()
    names = [a for a in sys.argv[1:] if not a.startswith("--")]
    for nm in (names or ["Daniil Medvedev", "Jaume Munar", "Grigor Dimitrov"]):
        show(matches, nm)
