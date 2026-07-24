-- engine/sql/schema.sql — Coupling Engine storage (Supabase / Postgres)
-- Apply via the Supabase SQL editor, or `apply_migration` once MCP access is granted.
--
-- Two tables:
--   matches      — the Sackmann match feed (source data for Elo / fade / fingerprint)
--   predictions  — the testing harness: every pre-lock forecast, graded later,
--                  built to enforce the operating discipline (the denominator,
--                  grade-the-conditional-not-the-headline, and CLV).

-- ---------------------------------------------------------------- matches
create table if not exists public.matches (
    id            bigserial primary key,
    tourney_id    text,
    tourney_name  text,
    surface       text,
    tourney_level text,
    tourney_date  date,
    match_num     integer,
    best_of       integer,
    round         text,
    minutes       integer,

    winner_name   text not null,
    winner_id     integer,
    winner_rank   integer,
    loser_name    text not null,
    loser_id      integer,
    loser_rank    integer,
    score         text,

    -- serve box score (winner / loser)
    w_ace integer, w_df integer, w_svpt integer, w_1stin integer,
    w_1stwon integer, w_2ndwon integer, w_bpsaved integer, w_bpfaced integer,
    l_ace integer, l_df integer, l_svpt integer, l_1stin integer,
    l_1stwon integer, l_2ndwon integer, l_bpsaved integer, l_bpfaced integer,

    created_at timestamptz not null default now(),
    -- natural key so re-loads upsert instead of duplicating
    unique (tourney_id, match_num)
);

create index if not exists matches_date_idx   on public.matches (tourney_date);
create index if not exists matches_winner_idx on public.matches (winner_name);
create index if not exists matches_loser_idx  on public.matches (loser_name);
create index if not exists matches_surface_idx on public.matches (surface);

-- ---------------------------------------------------------------- predictions
create table if not exists public.predictions (
    id            uuid primary key default gen_random_uuid(),
    created_at    timestamptz not null default now(),

    -- the matchup
    match_date    date,
    tournament    text,
    level         text,
    surface       text,
    best_of       integer,
    player_a      text not null,
    player_b      text not null,

    -- model vs market (taken at lock)
    model_prob_a  numeric,            -- Elo / engine probability for A
    market_prob_a numeric,            -- implied prob from the price at lock
    market_source text,               -- e.g. 'Kalshi'
    locked_at     timestamptz,

    -- the call
    pick          text,               -- 'A' or 'B'
    confidence    numeric,
    -- the Coupling-Engine conditional (freeze it; do not re-grade live)
    breaking_point text,              -- A's documented crack
    aggravator     text,              -- why B's parser stresses it
    dose_tags      jsonb,             -- time/space conditions, tiered
    conditional    text,              -- firing trigger, e.g. 'if reaches 3rd set -> B'

    -- settlement & grading
    settled            boolean not null default false,
    settled_at         timestamptz,
    result_winner      text,          -- 'A' or 'B'
    conditional_fired  boolean,       -- did the trigger fire as written?
    headline_correct   boolean,       -- did pick win?
    conditional_correct boolean,      -- did the conditional resolve as written?
    closing_prob_a     numeric,       -- closing line, for CLV
    clv                numeric,       -- market_prob_a edge vs close
    notes              text
);

create index if not exists predictions_match_date_idx on public.predictions (match_date);
create index if not exists predictions_settled_idx    on public.predictions (settled);
