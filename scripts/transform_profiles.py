"""Transform profile content based on each profile's own cognitive architecture.

Reads each profile JS file, extracts its spatial/temporal/reference scores
from the code string (e.g., "Balanced • Future • Self"), and applies the
content transformation pipeline to restructure fields like 'overview',
'howYouLearn', 'howYouCommunicate', etc.

Usage:
    python scripts/transform_profiles.py

This rewrites profile JS files in-place with restructured content.
"""
import json
import re
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
import argparse

from content_transform import modify_information

ROOT = Path(__file__).resolve().parent.parent

def code_to_scores(code: str) -> dict:
    """Convert code like 'Balanced • Future • Self' to numeric scores.
    
    Returns:
        {'spatial': 0-100, 'temporal': 0-100, 'reference': 0-100}
    """
    parts = [p.strip() for p in code.split('•')]
    if len(parts) != 3:
        return {'spatial': 50, 'temporal': 50, 'reference': 50}
    
    spatial_map = {'Concrete': 0, 'Balanced': 50, 'Abstract': 100}
    temporal_map = {'Past': 0, 'Present': 50, 'Future': 100}
    reference_map = {'Other': 0, 'Balanced': 50, 'Self': 100}
    
    spatial = spatial_map.get(parts[0], 50)
    temporal = temporal_map.get(parts[1], 50)
    reference = reference_map.get(parts[2], 50)
    
    return {'spatial': spatial, 'temporal': temporal, 'reference': reference}

def load_profile_js(filepath: Path) -> dict:
    """Parse a profile JS file and extract the profile object."""
    with filepath.open('r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Find: export const XyzProfile = { ... };
    match = re.search(r'export const \w+Profile = (\{.*\});', content, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find profile object in {filepath}")
    
    obj_str = match.group(1)
    try:
        profile = eval(obj_str)
    except Exception as e:
        raise ValueError(f"Could not parse profile object: {e}")
    
    return profile, content

def save_profile_js(filepath: Path, profile: dict, original_content: str) -> None:
    """Write profile back to JS file, preserving structure and comments."""
    # Simple approach: replace the profile object in place
    # Convert profile dict to JS-like format (with proper JSON for strings)
    import json
    
    # Build a JS object string
    lines = ['export const ' + filepath.stem + 'Profile = {']
    for key, value in profile.items():
        lines.append(f'  "{key}": {json.dumps(value, ensure_ascii=False)},')
    lines[-1] = lines[-1].rstrip(',')  # remove trailing comma from last item
    lines.append('};')
    
    obj_str = '\n'.join(lines)
    
    # Replace old object with new one
    new_content = re.sub(
        r'export const \w+Profile = \{.*?\};',
        obj_str,
        original_content,
        flags=re.DOTALL
    )
    
    with filepath.open('w', encoding='utf-8') as fh:
        fh.write(new_content)

def apply_profile_transformation(profile: dict, scores: dict) -> dict:
    """Apply content transformation to profile fields based on its own scores."""
    # Create a simple object with spatial/temporal/reference attributes
    class ProfileObj:
        def __init__(self, d):
            for k, v in d.items():
                setattr(self, k, v)
    
    prof_obj = ProfileObj(scores)
    
    # Fields to transform
    text_fields = ['overview', 'howYouLearn', 'howYouCommunicate', 'phrase', 
                   'secret', 'whatOthersGetWrong', 'hiddenSuperpower', 'blindSpot']
    
    transformed = dict(profile)
    
    for field in text_fields:
        if field in transformed and isinstance(transformed[field], str):
            original_text = transformed[field]
            modified = modify_information(original_text, prof_obj)
            if modified != original_text:
                transformed[field] = modified
    
    return transformed

def main():
    parser = argparse.ArgumentParser(description="Transform profiles; use --dry-run to preview without writing")
    parser.add_argument('--dry-run', action='store_true', help="Do not write changes; print summary")
    parser.add_argument('--verbose', action='store_true', help="Print before/after snippets for changed fields")
    args = parser.parse_args()

    # Load profile keys
    keys_file = ROOT / 'data' / 'profiles_keys.json'
    with keys_file.open('r') as fh:
        keys = json.load(fh)
    
    count_written = 0
    count_modified = 0
    for profile_name, profile_code in keys.items():
        profile_path = ROOT / f'{profile_name}.js'
        if not profile_path.exists():
            print(f"  Skipping {profile_name}: file not found")
            continue
        
        try:
            scores = code_to_scores(profile_code)
            profile, orig_content = load_profile_js(profile_path)
            transformed = apply_profile_transformation(profile, scores)
            if transformed != profile:
                count_modified += 1
                print(f"~ {profile_name}: WOULD MODIFY")
                if args.verbose:
                    for field in ['overview', 'howYouLearn', 'howYouCommunicate', 'phrase', 'secret', 'whatOthersGetWrong', 'hiddenSuperpower', 'blindSpot']:
                        a = profile.get(field)
                        b = transformed.get(field)
                        if isinstance(a, str) and a != b:
                            print(f"\n--- {profile_name}.{field} ---")
                            print("BEFORE:")
                            print(a[:200])
                            print("\nAFTER:")
                            print(b[:200])
                if not args.dry_run:
                    save_profile_js(profile_path, transformed, orig_content)
                    print(f"✓ {profile_name}")
                    count_written += 1
                else:
                    print(" (dry-run: not written)")
            else:
                print(f"  {profile_name}: no changes")
        except Exception as e:
            print(f"✗ {profile_name}: {e}")
    
    if args.dry_run:
        print(f"\nDry-run complete. {count_modified} profiles would be modified. {count_written} profiles written (zero in dry-run).")
    else:
        print(f"\nTransformed {count_written} profiles. {count_modified} profiles modified.")

if __name__ == '__main__':
    main()
