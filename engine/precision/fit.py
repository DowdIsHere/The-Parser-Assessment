"""
FIT — the physical read: can the body BRING and SUSTAIN the shape the frame reads?
Companion to gates/rally (reception); FIT is delivery-across-time.

*** TESTING ARTIFACT — NOT VALIDATED. Do not use in a live read until backtested. ***
Nothing here fires a verdict. FIT is a PRESENTED layer, read across the frame in the
author's voice — never a trigger, never a flip of the favored side.

Four factors, each only what we actually OBSERVED (or researched) this week:

  DURABILITY (fade)   — deciding-set win% from OUR charting data (Khachanov 2-10 caught it).
                        Computed offline into 'Precision - FIT Durability (Deciding Sets).csv'.
                        Frozen at May 21; thin where n is small.
  FATIGUE (load)      — rest-DECAYED recent load off the match log (Mensik's 5-setter).
                        Load from a match decays to 0 over REST_WINDOW days — so a large
                        gap correctly zeroes it. Input: [(score, days_ago), ...].
  ROUNDING-IN (rust)  — matches since a return from layoff. Research: timing/rhythm rebuild,
                        heaviest at return, DECAYS with matches back (Dimitrov's 0-for-5 was
                        this, resolved by the time he beat Mensik). Input: matches_since_return.
  INJURY (condition)  — real-world news; not computable. Input: a note string.

REST_WINDOW and ROUNDIN_SPAN are author-set knobs, NOT validated constants.
"""
import csv
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
DUR_F = os.path.join(ROOT, "Precision - FIT Durability (Deciding Sets).csv")

REST_WINDOW = 10   # days for a match's fatigue load to decay to ~0 (author knob, unvalidated)
ROUNDIN_SPAN = 5   # matches-back over which rounding-in rust fades (author knob, unvalidated)


def _norm(s):
    return set(s.lower().replace("-", " ").replace(".", "").split())


def _load_dur():
    D = {}
    if os.path.exists(DUR_F):
        for r in csv.DictReader(open(DUR_F)):
            D[r["player"].strip()] = r
    return D


_DUR = _load_dur()


def durability(name):
    """(W, L, n, win%) in deciding sets from our charting, or None."""
    want = _norm(name)
    for k, r in _DUR.items():
        kk = _norm(k)
        if kk == want or want <= kk or kk <= want:
            n = int(r["n"]) if r["n"] else 0
            return int(r["decider_W"]), int(r["decider_L"]), n, (int(r["decider_win%"]) if r["decider_win%"] else None)
    return None


def _games_sets(score):
    g = s = 0
    for chunk in score.split(","):
        chunk = re.sub(r"\(.*?\)", "", chunk).strip()
        m = re.match(r"(\d+)\D+(\d+)", chunk)
        if m:
            g += int(m.group(1)) + int(m.group(2))
            s += 1
    return g, s


def fatigue(recent):
    """recent: [(score, days_ago), ...] this player's recent matches.
    Rest-decayed load: each match's games weighted by (1 - days_ago/REST_WINDOW),
    clamped at 0 — so anything older than REST_WINDOW contributes nothing."""
    load = 0.0
    last = None
    hot5 = False
    for score, days in recent:
        w = max(0.0, 1 - days / REST_WINDOW)
        g, s = _games_sets(score)
        load += g * w
        last = days if last is None else min(last, days)
        if s >= 5 and w > 0:
            hot5 = True
    return dict(load=round(load), days_since=last, five_in_window=hot5)


def rounding_in(matches_since_return):
    """rust that fades with matches back. None if not a recent returner."""
    if matches_since_return is None:
        return None
    r = max(0.0, 1 - matches_since_return / ROUNDIN_SPAN)
    return round(r, 2)  # 1.0 = just back (max rust) → 0 = rounded in


def player(name, recent=None, injury=None, matches_since_return=None):
    d = durability(name)
    f = fatigue(recent) if recent else None
    ri = rounding_in(matches_since_return)
    return dict(name=name, dur=d, fat=f, roundin=ri, injury=injury)


def _fmt_dur(d):
    if not d:
        return "durability: no data"
    W, L, n, pct = d
    warn = "  (thin n)" if n < 8 else ""
    return f"durability: {W}-{L} deciders ({pct}%, n={n}){warn}"


def report(a, b, a_recent=None, b_recent=None, a_inj=None, b_inj=None, a_ret=None, b_ret=None):
    print("FIT report  *** TESTING — presented layer, not a verdict ***")
    for nm, rec, inj, ret in [(a, a_recent, a_inj, a_ret), (b, b_recent, b_inj, b_ret)]:
        p = player(nm, rec, inj, ret)
        line = f"  {nm.split()[-1]:14} {_fmt_dur(p['dur'])}"
        if p["fat"]:
            fl = p["fat"]
            line += f" | fatigue load {fl['load']} (last match {fl['days_since']}d ago"
            line += ", +5-setter in window" if fl["five_in_window"] else ""
            line += ")"
        if p["roundin"] is not None:
            line += f" | rounding-in {p['roundin']} (1=just back, 0=sharp)"
        if p["injury"]:
            line += f" | INJURY: {p['injury']}"
        print(line)
    print("  → read FIT across the frame's shape: a big surplus survives a soft FIT; a thin")
    print("    edge on a low-durability, high-load, or freshly-returned body is where it bends.")


if __name__ == "__main__":
    print("=== Mensik vs Dimitrov (R2) ===")
    report("Jakub Mensik", "Grigor Dimitrov",
           a_recent=[("5-7, 6-3, 6-3, 3-6, 7-6", 2)],   # 5-setter, 2 days ago
           b_recent=[("7-6, 6-3, 7-5", 2)],
           b_ret=6)                                       # Dimitrov several matches into his comeback
    print()
    print("=== Khachanov vs Cobolli (R3) — the wall + fade ===")
    report("Karen Khachanov", "Flavio Cobolli")          # durability only (no verified recent scores)
