"""Extract profile 'key' from line 3 of each profile file.

Scans the repository root for `*.js` files that look like profile files
and reads line 3 (1-based) to extract the key comment (e.g. "Balanced • Future • Self").
Outputs `data/profiles_keys.json` with a map: { "actualized": "Balanced • Future • Self", ... }

Usage:
    python scripts/extract_profile_keys.py

This script is conservative: it skips `server.js`, `index.js`, and
`profiles-group-*.js` files. It only needs Python's standard library.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / 'data'
OUT_DIR.mkdir(exist_ok=True)
OUT_FILE = OUT_DIR / 'profiles_keys.json'

EXCLUDE = {'server.js', 'index.js', 'package.json', 'README.md'}

def extract_key_from_line(line: str) -> str:
    if not line:
        return ''
    # remove leading // or /* */ style markers
    s = line.strip()
    s = re.sub(r'^//+\s*', '', s)
    s = re.sub(r'^/\*+\s*', '', s)
    s = re.sub(r'\s*\*+/\s*$', '', s)
    return s.strip()

def main():
    results = {}
    for p in ROOT.glob('*.js'):
        if p.name in EXCLUDE or p.name.startswith('profiles-group'):
            continue
        try:
            with p.open('r', encoding='utf-8') as fh:
                lines = fh.readlines()
            # line 3 => index 2
            key_line = lines[2] if len(lines) >= 3 else ''
            key = extract_key_from_line(key_line)
            if key:
                results[p.stem] = key
        except Exception as e:
            print(f"Skipping {p.name}: {e}")

    with OUT_FILE.open('w', encoding='utf-8') as fh:
        json.dump(results, fh, indent=2, ensure_ascii=False)

    print(f"Wrote {len(results)} keys to {OUT_FILE}")

if __name__ == '__main__':
    main()
