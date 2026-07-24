#!/usr/bin/env python3
"""Stamp the shared chrome onto every page.

The site has no build step, so each page carries its own copy of the header,
nav and legal notice. That is exactly the part that drifts when a page is
regenerated from scratch: a new page arrives with the logo on a dead path, or
a nav whose Assessments menu points at the analysis pages, or a footer that
quietly lost its disclaimer.

This script re-applies the canonical versions from partials/ so those never
have to be caught by eye.

    python3 tools/sync-chrome.py --check    # report drift, change nothing
    python3 tools/sync-chrome.py            # fix it

What it enforces, per page:

  * the site.css link, loaded before the page's own <style> so page rules win
  * <nav id="siteNav"> matches partials/nav.html, keeping any page-specific
    CTA pill (index has "Begin Assessment", the kids page has "Take Assessment")
  * the brand mark is the cropped lockup, never <img src=".../27parser-logo.png">
  * mobile-nav.css / mobile-nav.js are present wherever the dropdown nav is
  * the legal notice is present exactly once

Pages with no dropdown nav are left alone apart from the mark, the legal
notice and the site.css link. That is deliberate: the assessment and sign-in
pages run deliberately minimal chrome, and nav links mid-funnel would be an
invitation to leave.
"""

import argparse
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "partials"

DEAD_LOGO = re.compile(r'<img\s+src="/images/27parser-logo\.png"[^>]*>')
MARK_SPAN = '<span class="mark" role="img" aria-label="27Parser™"></span>'
CSS_LINK = '  <link rel="stylesheet" href="/site.css">\n'
CTA_RE = re.compile(r'\n\s*<a href="[^"]*" class="(?:btn|cta)">[^<]*</a>')

# directories that are not the live site
SKIP_DIRS = {"archive", "templates", "partials", "tools", "mobile", "kids", "lib", "images"}


def read(p):
    return p.read_text(encoding="utf-8")


def canonical_nav():
    return read(PARTIALS / "nav.html").rstrip()


def legal_block():
    return read(PARTIALS / "legal-notice.html")


def sync(path, fix):
    src = read(path)
    s = src
    notes = []

    # 1. shared stylesheet, ahead of the page's own rules
    if "/site.css" not in s:
        i = s.find("  <style>")
        if i == -1:
            i = s.find("<style>")
        s = (s[:i] + CSS_LINK + s[i:]) if i != -1 else s.replace("</head>", CSS_LINK + "</head>", 1)
        notes.append("added site.css link")

    # 2. brand mark — never the dead image path
    if DEAD_LOGO.search(s):
        s = DEAD_LOGO.sub(MARK_SPAN, s)
        notes.append("replaced dead logo img with .mark")

    # 3. nav, preserving whatever CTA pill the page chose to carry
    m = re.search(r'<nav id="siteNav".*?</nav>', s, re.S)
    if m:
        current = m.group(0)
        cta = re.search(r'<a href="[^"]*" class="(?:btn|cta)">[^<]*</a>', current)
        wanted = canonical_nav()
        if cta:
            wanted = wanted.replace("      </nav>", "        " + cta.group(0) + "\n      </nav>")
        if re.sub(r"\s+", " ", current) != re.sub(r"\s+", " ", wanted):
            s = s[: m.start()] + wanted + s[m.end():]
            notes.append("nav did not match partials/nav.html")

        # 4. the drawer needs its stylesheet, script, button and scrim
        if "mobile-nav.css" not in s:
            s = s.replace("</head>", '  <link rel="stylesheet" href="/mobile-nav.css">\n</head>', 1)
            notes.append("added mobile-nav.css")
        if "mobile-nav.js" not in s:
            s = s.replace("</body>", '  <script src="/mobile-nav.js" defer></script>\n</body>', 1)
            notes.append("added mobile-nav.js")
        if "nav-toggle" not in s:
            btn = (
                '      <button class="nav-toggle" type="button" aria-label="Open menu" '
                'aria-expanded="false" aria-controls="siteNav">\n'
                "        <span class=\"bar\"></span><span class=\"bar\"></span><span class=\"bar\"></span>\n"
                "      </button>\n"
            )
            s = re.sub(r"([ \t]*</nav>\n)", r"\1" + btn, s, count=1)
            notes.append("added nav-toggle")
        if "nav-scrim" not in s:
            s = re.sub(r"([ \t]*</header>\n)", r'\1  <div class="nav-scrim"></div>\n', s, count=1)
            notes.append("added nav-scrim")

    # 5. legal notice, exactly once
    hits = s.count("Patent Pending (Provisional #63/968,676)")
    if hits == 0:
        block = legal_block()
        if "</footer>" in s:
            s = re.sub(r"([ \t]*)</footer>", block + r"\1</footer>", s, count=1)
        else:
            s = s.replace("</body>", '  <footer class="site-legal">\n' + block + "  </footer>\n</body>", 1)
        notes.append("added legal notice")
    elif hits > 1:
        notes.append(f"legal notice appears {hits}x — needs a human")

    if notes and fix and s != src:
        path.write_text(s, encoding="utf-8")
    return notes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="report drift without changing anything")
    ap.add_argument("pages", nargs="*", help="specific pages (default: every live page)")
    args = ap.parse_args()

    if args.pages:
        targets = [pathlib.Path(p) for p in args.pages]
    else:
        targets = sorted(p for p in ROOT.glob("*.html") if p.parent.name not in SKIP_DIRS)

    drifted = 0
    for p in targets:
        notes = sync(p, fix=not args.check)
        if notes:
            drifted += 1
            verb = "would fix" if args.check else "fixed"
            print(f"  {p.name:28} {verb}: {'; '.join(notes)}")

    if not drifted:
        print(f"  all {len(targets)} pages already match the canonical chrome")
        return 0
    if args.check:
        print(f"\n{drifted} page(s) have drifted. Run without --check to fix.")
        return 1
    print(f"\n{drifted} page(s) updated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
