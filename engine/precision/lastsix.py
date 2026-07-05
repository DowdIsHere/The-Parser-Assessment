"""
DEEP-RUN set-story (durability observation build — NOT wired into FIT).

The flat career decider% is the wrong instrument: most players lose early, so
"deciders won/lost" just counts losers. What tells the stamina story is the SET
COST of a DEEP RUN — the last 3 rounds of a tournament, where the body is already
loaded. Read across a player's most recent deep runs (tournaments with 3+ charted
matches), the set scores show whether the body cruises the back end (a wall of
2-0s) or grinds/wars its way deep (2-1s, a 3-2 five-set war) and whether a long
match left the next one spent.

Best-of-five deep runs (Slams) are charted thinly, so we use whatever BO5 exists
and fall back on the BO3 runs, which are dense. Retirements (winner short of the
sets needed) are tagged RET — a stoppage is not a set-story.

Reconstructs each match's final set tally + winner from the last charted point
(Set1/Set2 = completed sets; last point's winner = match winner). Caches to
engine/data/mcp/_match_tally.csv so re-runs are instant. Frozen at May 21 2026.
"""
import sys, csv, os, collections
sys.path.insert(0, os.path.dirname(__file__))
import mcp_data

CACHE = os.path.join(os.path.dirname(__file__), "..", "data", "mcp", "_match_tally.csv")
RANK = {"R128": 1, "RR": 1, "R64": 2, "R32": 3, "R16": 4, "QF": 5, "SF": 6, "F": 7,
        "Q1": 0, "Q2": 0, "Q3": 0}


def build_cache():
    meta = mcp_data.load_match_meta()
    last = {}
    for row in mcp_data.iter_points("m"):
        mid = row["match_id"]
        try:
            s1 = int(row["Set1"]); s2 = int(row["Set2"])
        except Exception:
            continue
        last[mid] = (s1, s2, row.get("PtWinner", ""))
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["match_id", "date", "bo", "p1", "p2", "winner", "fs1", "fs2", "surface"])
        for mid, (s1, s2, pw) in last.items():
            m = meta.get(mid)
            if not m or pw not in ("1", "2"):
                continue
            bo = m["best_of"]; p1, p2 = m["p1"], m["p2"]
            fs1 = s1 + (1 if pw == "1" else 0)
            fs2 = s2 + (1 if pw == "2" else 0)
            winner = p1 if pw == "1" else p2
            w.writerow([mid, mid[:8], bo, p1, p2, winner, fs1, fs2, m["surface"]])


def _tourney(mid):
    p = mid.split("-")
    return p[2] if len(p) > 2 else "?"


def load():
    meta = mcp_data.load_match_meta()
    matches = collections.defaultdict(list)
    with open(CACHE) as f:
        for r in csv.DictReader(f):
            bo = int(r["bo"]); fs1 = int(r["fs1"]); fs2 = int(r["fs2"])
            req = 2 if bo == 3 else 3
            ret = max(fs1, fs2) < req            # winner short of sets needed -> stoppage
            rnd = meta.get(r["match_id"], {}).get("round", "")
            for who in (r["p1"], r["p2"]):
                mine = who == r["p1"]
                matches[who].append(dict(
                    mid=r["match_id"], date=r["date"], bo=bo, round=rnd,
                    rank=RANK.get(rnd, 3), tourney=_tourney(r["match_id"]),
                    won=(who == r["winner"]), ret=ret,
                    setscore=(f"{fs1}-{fs2}" if mine else f"{fs2}-{fs1}"),
                    sets=fs1 + fs2, opp=(r["p2"] if mine else r["p1"])))
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


def deep_runs(matches, name, n=6):
    """Most-recent tournaments with 3+ charted matches -> last 3 rounds each."""
    k = find(matches, name)
    if not k:
        return None, []
    inst = collections.defaultdict(list)
    for m in matches[k]:
        inst[(m["date"][:4], m["tourney"])].append(m)
    runs = [(max(x["date"] for x in ms), key, ms) for key, ms in inst.items() if len(ms) >= 3]
    runs.sort(reverse=True)
    out = []
    for _, (yr, tn), ms in runs[:n]:
        last3 = sorted(ms, key=lambda x: x["rank"])[-3:]
        out.append((yr, tn, last3))
    return k, out


def deeprun(matches, name):
    k, runs = deep_runs(matches, name)
    if not k:
        print(f"{name}: not found\n"); return
    if not runs:
        print(f"===== {name} — no deep runs (never 3+ charted matches in a tournament) =====")
        print("    the absence IS the read: no back-end set load to carry.\n")
        return
    print(f"===== {k} — deep runs (last 3 rounds), most recent {len(runs)} =====")
    print("     event                    fmt  last-3 rounds set-story        sets   (rounds)")
    for yr, tn, last3 in runs:
        cells = []
        for x in last3:
            tag = "ret" if x["ret"] else ("W" if x["won"] else "L")
            cells.append(f"{x['setscore']}{tag}")
        fmt = f"BO{last3[-1]['bo']}"
        setpat = "·".join(str(x["sets"]) for x in last3)
        rounds = "/".join(x["round"] for x in last3)
        print(f"  {yr} {tn:24} {fmt:4} {'  '.join(f'{c:6}' for c in cells)}  {setpat:6} ({rounds})")
    bos = [r[2][-1]["bo"] for r in runs]
    print(f"    format mix: {bos.count(3)} BO3 / {bos.count(5)} BO5  "
          f"(BO5 = Slams, charted thinly; threes are the floor)\n")


if __name__ == "__main__":
    if not os.path.exists(CACHE) or "--rebuild" in sys.argv:
        print("building match tally cache ...", flush=True)
        build_cache()
        print("done.", flush=True)
    matches = load()
    names = [a for a in sys.argv[1:] if not a.startswith("--")]
    for nm in (names or ["Daniil Medvedev", "Jaume Munar", "Grigor Dimitrov"]):
        deeprun(matches, nm)
