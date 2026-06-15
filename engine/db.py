"""
engine/db.py — local store for the testing harness (SQLite mirror of schema.sql).

Same columns as the Supabase `predictions` table, so the harness runs now and
lifts straight into Supabase once access is granted (swap connect() for a
PostgREST/psycopg writer; the row dicts are identical).
"""

import os
import sqlite3

DEFAULT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "cbi.sqlite")

PREDICTIONS_DDL = """
create table if not exists predictions (
    id integer primary key autoincrement,
    created_at text default current_timestamp,
    run_tag text,
    match_date text,
    tournament text,
    level text,
    surface text,
    best_of integer,
    player_a text not null,
    player_b text not null,
    model_prob_a real,        -- Elo baseline P(A)
    adj_prob_a real,          -- coupling-adjusted P(A)
    market_prob_a real,       -- implied from price at lock (live only)
    market_source text,
    pick text,                -- 'A' or 'B'
    confidence real,
    breaking_point text,
    aggravator text,
    dose_tags text,           -- json
    conditional text,
    settled integer default 0,
    result_winner text,       -- 'A' or 'B'
    conditional_fired integer,
    headline_correct integer,
    conditional_correct integer,
    closing_prob_a real,
    clv real,
    notes text
);
"""


def connect(path=DEFAULT_PATH):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(PREDICTIONS_DDL)
    return conn


def insert_prediction(conn, **f):
    cols = ", ".join(f.keys())
    qs = ", ".join("?" for _ in f)
    conn.execute(f"insert into predictions ({cols}) values ({qs})", list(f.values()))


def clear_run(conn, run_tag):
    conn.execute("delete from predictions where run_tag = ?", (run_tag,))
