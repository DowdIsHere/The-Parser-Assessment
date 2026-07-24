# Archive

Nothing on this site gets erased. Anything retired or superseded is moved here
instead of being deleted.

## Naming

- `<name>.html` — a retired page. It is no longer linked from the site.
- `<name>.<YYYY-MM-DD>.html` — a version that was replaced on that date. The
  live page kept the original filename.

## Contents

| File | Why it is here |
|---|---|
| `kid-parsers.html` | Retired 2026-07-24. Duplicated `kids-individual.html` — both carried the title "The 27 Kid Parsers™ \| Parser Profile — Kid Edition". `clinicians.html` and `hub.html` linked to it and now point at `kids-individual.html`. |
| `individual.2026-07-24.html` | Replaced 2026-07-24 by a new revision. |
| `kids-individual.2026-07-24.html` | Replaced 2026-07-24 by a new revision. |
| `images/27parser-logo.png` | Superseded logo. Every page once referenced this path, but the file was missing from the repo, so the logo was broken site-wide. The current mark is the transparent coin lockup at `/27parser.png`. |

## Before retiring a page

1. Move it here — `git mv <page>.html archive/` — never `rm`.
2. Repoint anything that linked to it, or the link 404s.
3. Add a row above saying what replaced it and why.
