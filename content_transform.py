"""Content transformation utilities for Parser Profile adaptations.

This module implements a lightweight, dependency-free version of the
procedures you supplied: analysis of abstraction, temporality, reference,
and a modification pipeline that applies structural, content, vocabulary,
temporal and reference adjustments based on profile deltas.

Note: implementations are heuristic and intentionally simple so they
work without external NLP libraries. Replace or extend helpers as
needed for production use.
"""
import re
from math import fabs
from collections import Counter

# ----------------------------- Helpers ---------------------------------
def _tokenize(text):
    return re.findall(r"\w+", (text or '').lower())

# ---------------------- Analysis Procedures -----------------------------
def calculate_abstraction_level(text):
    concrete_markers = {"example", "instance", "specifically", "such", "for", "like", "e.g"}
    abstract_markers = {"concept", "principle", "theory", "framework", "generally", "abstract"}
    tokens = _tokenize(text)
    concrete_count = sum(1 for t in tokens if t in concrete_markers)
    abstract_count = sum(1 for t in tokens if t in abstract_markers)
    total = concrete_count + abstract_count + 1
    score = (abstract_count / total) * 100
    return score

def analyze_temporal_orientation(text):
    past_indicators = {"was", "were", "had", "did", "ago", "previous", "historical", "established"}
    future_indicators = {"will", "would", "could", "might", "future", "potential", "upcoming"}
    tokens = _tokenize(text)
    past_matches = sum(1 for t in tokens if t in past_indicators)
    future_matches = sum(1 for t in tokens if t in future_indicators)
    total = past_matches + future_matches + 1
    score = (future_matches / total) * 100
    return score

def analyze_reference_frame(text):
    self_markers = {"i", "me", "my", "mine", "personal", "individual"}
    other_markers = {"we", "they", "our", "their", "everyone", "society", "team"}
    tokens = _tokenize(text)
    self_count = sum(1 for t in tokens if t in self_markers)
    other_count = sum(1 for t in tokens if t in other_markers)
    total = self_count + other_count + 1
    score = (self_count / total) * 100
    return score

def analyze_structured_data(data):
    # Very small heuristic summary for dictionaries / lists
    def depth(obj):
        if isinstance(obj, dict):
            if not obj:
                return 1
            return 1 + max(depth(v) for v in obj.values())
        if isinstance(obj, list):
            if not obj:
                return 1
            return 1 + max(depth(v) for v in obj)
        return 0

    if not isinstance(data, (dict, list)):
        return {"density": 0, "abstraction": 0, "structure": "scalar"}

    field_count = 0
    label_complexity = 0

    if isinstance(data, dict):
        field_count = len(data)
        label_complexity = sum(len(re.findall(r"[aeiouy]+", k)) for k in data.keys())
    else:
        field_count = len(data)
        label_complexity = field_count

    nesting = depth(data)
    overall_density = field_count * nesting
    overall_abstraction = label_complexity + (1 if nesting > 2 else 0)
    struct_type = "table" if isinstance(data, list) and all(isinstance(i, dict) for i in data) else (
        "tree" if nesting > 2 else "list"
    )

    return {"density": overall_density, "abstraction": overall_abstraction, "structure": struct_type}

# ---------------- Transformation primitives ----------------------------
def segment_by_idea(content):
    # split by two newlines or sentence boundaries as fallback
    if not content:
        return []
    parts = [p.strip() for p in re.split(r"\n\n+", content) if p.strip()]
    if len(parts) > 1:
        return parts
    # fallback: split into sentences
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", content) if s.strip()]

def format_as_bullets(segments):
    return "\n".join(f"- {s}" for s in segments)

def create_narrative_flow(content):
    # naive: ensure paragraphs and join with connective phrases
    paras = segment_by_idea(content)
    if not paras:
        return ""
    flow = []
    for i, p in enumerate(paras):
        flow.append(p)
        if i != len(paras) - 1:
            flow.append("Furthermore,")
    return "\n\n".join(flow)

def hybrid_structure(content):
    parts = segment_by_idea(content)
    half = len(parts) // 2 or 1
    return format_as_bullets(parts[:half]) + "\n\n" + "\n\n".join(parts[half:])

# ---------------- Stage implementations ---------------------------------
def structural_transformation(content, profile):
    if getattr(profile, "temporal", 50) < 100:
        segments = segment_by_idea(content)
        return format_as_bullets(segments)
    elif getattr(profile, "temporal", 50) > 1000:
        return create_narrative_flow(content)
    else:
        return hybrid_structure(content)

def generate_examples(content, max_examples=3):
    sentences = [s for s in re.split(r"(?<=[.!?])\s+", content) if s.strip()]
    return sentences[:max_examples]

def insert_examples(content, examples):
    if not examples:
        return content
    return content + "\n\nExamples:\n" + "\n".join(f"- {e}" for e in examples)

def extract_principles(content):
    # pick noun-like short phrases as 'principles' (heuristic)
    tokens = _tokenize(content)
    counts = Counter(tokens)
    common = [w for w, _ in counts.most_common(5) if len(w) > 3]
    return common

def highlight_principles(content, principles):
    if not principles:
        return content
    highlights = "Principles: " + ", ".join(principles)
    return highlights + "\n\n" + content

def content_augmentation(content, profile):
    augmented = content or ""
    if getattr(profile, "spatial", 50) < 40:
        examples = generate_examples(content)
        augmented = insert_examples(augmented, examples)
    if getattr(profile, "spatial", 50) > 60:
        principles = extract_principles(content)
        augmented = highlight_principles(augmented, principles)
    return augmented

def simplify_vocabulary(text):
    mapping = {
        "facilitates": "helps",
        "demonstrates": "shows",
        "obtains": "gets",
        "utilizes": "uses",
        "entity": "thing",
        "initiate": "start",
        "terminate": "end",
    }
    def repl(m):
        return mapping.get(m.group(0).lower(), m.group(0))
    pattern = re.compile("\\b(" + "|".join(re.escape(k) for k in mapping.keys()) + ")\\b", re.IGNORECASE)
    return pattern.sub(repl, text)

def maintain_technical_terms(text):
    return text

def shorten_sentences(text):
    # naive: split long sentences into shorter clauses
    parts = re.split(r"(?<=[.!?])\s+", text)
    short = []
    for p in parts:
        if len(p) > 140:
            clauses = re.split(r",\s+|;\s+", p)
            short.extend(c.strip() + '.' for c in clauses if c.strip())
        else:
            short.append(p)
    return " ".join(short)

def maintain_complex_sentences(text):
    return text

def linguistic_adaptation(content, profile):
    if getattr(profile, "spatial", 50) < 40:
        content = simplify_vocabulary(content)
    else:
        content = maintain_technical_terms(content)
    if getattr(profile, "temporal", 50) < 100:
        content = shorten_sentences(content)
    else:
        content = maintain_complex_sentences(content)
    return content

def add_icons(content):
    return content.replace("🔮", "🔮 ")

def add_color_coding(content):
    return content

def increase_white_space(content):
    return re.sub(r"\n{2,}", "\n\n\n", content)

def add_section_breaks(content):
    return content.replace('\n\n', '\n\n---\n\n')

def visual_enhancement(content, profile):
    result = content
    if getattr(profile, "temporal", 50) < 100:
        result = add_icons(result)
        result = add_color_coding(result)
    if getattr(profile, "spatial", 50) < 40:
        result = increase_white_space(result)
        result = add_section_breaks(result)
    return result

# -------------------- Modification pipeline ----------------------------
def modify_information(content, user_profile, content_analysis=None):
    if content_analysis is None:
        content_analysis = {
            "abstraction": calculate_abstraction_level(content),
            "temporality": analyze_temporal_orientation(content),
            "reference": analyze_reference_frame(content),
        }

    spatial_delta = abs(getattr(user_profile, "spatial", 50) - content_analysis.get("abstraction", 50))
    temporal_delta = abs(getattr(user_profile, "temporal", 50) - content_analysis.get("temporality", 50))
    reference_delta = abs(getattr(user_profile, "reference", 50) - content_analysis.get("reference", 50))

    total_mod = (spatial_delta + temporal_delta + reference_delta) / 3
    if total_mod < 20:
        return content

    # Apply hierarchy
    result = content
    # Structural
    if spatial_delta > 10:
        result = structural_transformation(result, user_profile)
    # Content
    if spatial_delta > 15:
        result = content_augmentation(result, user_profile)
    # Vocabulary / linguistic
    if spatial_delta > 5 or temporal_delta > 5:
        result = linguistic_adaptation(result, user_profile)
    # Temporal
    if temporal_delta > 10:
        # simple temporal injection: add a 'Future implications' or 'Historical context' block
        if getattr(user_profile, "temporal", 50) > 60:
            result = result + "\n\nFuture possibilities: Consider how this might evolve..."
        else:
            result = "Historical context: Review prior examples.\n\n" + result
    # Reference
    if reference_delta > 10:
        if getattr(user_profile, "reference", 50) > 60:
            # make more self-focused
            result = re.sub(r"\bwe\b|\bour\b|\bus\b", "you", result, flags=re.IGNORECASE)
        else:
            result = re.sub(r"\bi\b|\bmy\b|\bme\b", "we", result, flags=re.IGNORECASE)

    # Presentation
    result = visual_enhancement(result, user_profile)
    return result

if __name__ == "__main__":
    # simple smoke test
    class P: pass
    p = P(); p.spatial=30; p.temporal=20; p.reference=70
    sample = "This is a concept-heavy paragraph. It illustrates a principle and suggests future action. For instance, use this framework to guide work."
    print(modify_information(sample, p))
