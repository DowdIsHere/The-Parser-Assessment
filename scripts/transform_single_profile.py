"""Transform a single profile, respecting encoding patterns and rules."""
import json
import re
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from content_transform import modify_information

def code_to_scores(code: str) -> dict:
    """Convert code like 'Concrete • Past • Self' to numeric scores."""
    parts = [p.strip() for p in code.split('•')]
    if len(parts) != 3:
        return {'spatial': 50, 'temporal': 50, 'reference': 50}
    
    spatial_map = {'Concrete': 0, 'Balanced': 50, 'Abstract': 100}
    temporal_map = {'Past': 0, 'Present': 50, 'Future': 100}
    reference_map = {'Other': 0, 'Balanced': 50, 'Self': 100}
    
    return {
        'spatial': spatial_map.get(parts[0], 50),
        'temporal': temporal_map.get(parts[1], 50),
        'reference': reference_map.get(parts[2], 50),
    }

def load_profile_js(filepath: Path):
    """Load profile JS file and return (profile_dict, original_content)."""
    with filepath.open('r', encoding='utf-8') as fh:
        content = fh.read()
    
    match = re.search(r'export const (\w+)Profile = (\{.*?\n\};)', content, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find profile object in {filepath}")
    
    profile_name = match.group(1)
    obj_str = match.group(2)
    
    try:
        profile = eval(obj_str)
    except Exception as e:
        raise ValueError(f"Could not parse profile: {e}")
    
    return profile, content, profile_name, obj_str

def apply_transformation(profile: dict, scores: dict) -> dict:
    """Apply content transformation to text fields."""
    class ProfileObj:
        def __init__(self, d):
            for k, v in d.items():
                setattr(self, k, v)
    
    prof_obj = ProfileObj(scores)
    
    text_fields = ['overview', 'howYouLearn', 'howYouCommunicate', 'phrase', 
                   'secret', 'whatOthersGetWrong', 'hiddenSuperpower', 'blindSpot']
    
    transformed = dict(profile)
    
    for field in text_fields:
        if field in transformed and isinstance(transformed[field], str):
            original = transformed[field]
            modified = modify_information(original, prof_obj)
            transformed[field] = modified
    
    return transformed

def profile_to_js(profile: dict, profile_name: str) -> str:
    """Convert profile dict back to JS export format."""
    lines = [f'export const {profile_name}Profile = {{']
    
    for key, value in profile.items():
        if isinstance(value, str):
            # JSON encode string, preserving \n as literal newlines
            json_str = json.dumps(value, ensure_ascii=False)
            lines.append(f'  "{key}": {json_str},')
        elif isinstance(value, list):
            json_str = json.dumps(value, ensure_ascii=False, indent=4)
            lines.append(f'  "{key}": {json_str},')
        else:
            json_str = json.dumps(value, ensure_ascii=False)
            lines.append(f'  "{key}": {json_str},')
    
    # Remove trailing comma from last field
    if lines[-1].endswith(','):
        lines[-1] = lines[-1][:-1]
    
    lines.append('};')
    return '\n'.join(lines)

def main():
    profile_name = 'sharp'
    root = Path(__file__).resolve().parent.parent
    profile_path = root / f'{profile_name}.js'
    
    if not profile_path.exists():
        print(f"Error: {profile_path} not found")
        return
    
    try:
        profile, orig_content, pname, old_obj = load_profile_js(profile_path)
        
        # Get profile code from line 3
        lines = orig_content.split('\n')
        code_line = lines[2].strip() if len(lines) > 2 else ""
        code = re.sub(r'^//\s*', '', code_line)
        
        scores = code_to_scores(code)
        print(f"Profile: {pname}")
        print(f"Code: {code}")
        print(f"Scores: spatial={scores['spatial']}, temporal={scores['temporal']}, reference={scores['reference']}")
        
        transformed = apply_transformation(profile, scores)
        
        # Show sample transformation
        if 'overview' in profile and 'overview' in transformed:
            print(f"\n--- OVERVIEW (first 200 chars) ---")
            print(f"BEFORE:\n{profile['overview'][:200]}")
            print(f"\nAFTER:\n{transformed['overview'][:200]}")
        
        # Generate new JS
        new_obj_str = profile_to_js(transformed, pname)
        
        # Show snippet
        print(f"\n--- NEW JS EXPORT (first 500 chars) ---")
        print(new_obj_str[:500])
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
