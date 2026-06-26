// Parser Profile™ — Block Accessibility Map
// © 2026 Cognition Blocks LLC. All rights reserved.
//
// Maps each of the 27 adult profiles (and their kid-name equivalents)
// to the eight Cognition Blocks Inventory (CBI) blocks, sorted into
// high / moderate / low accessibility tiers. Source of truth for
// both the adult assessment and the kids assessment.

// Eight canonical blocks measured by CBI
export const ALL_BLOCKS = [
  "Pattern Recognition",
  "Symbolic Manipulation",
  "Generative Creation",
  "Self-Reference Processing",
  "Sequential Processing",
  "Spatial Relationships",
  "Perceptual Discrimination",
  "Social Signal Processing"
];

// Kid-friendly labels for each block, used in the kids assessment UI.
// The technical name is the source of truth; this is just the display
// translation for younger readers.
export const blockKidLabels = {
  "Pattern Recognition":      "Spotting Patterns",
  "Symbolic Manipulation":    "Working with Big Ideas",
  "Generative Creation":      "Making New Stuff Up",
  "Self-Reference Processing": "Knowing Yourself",
  "Sequential Processing":    "Doing Things in Order",
  "Spatial Relationships":    "Picturing How Things Fit",
  "Perceptual Discrimination": "Noticing Tiny Details",
  "Social Signal Processing": "Reading People"
};

// Adult-name (UPPERCASE) → block tiers.
// Each entry also carries the kid-side metadata so consumers can look
// up by kid code (e.g. "high-high-high") or kid name ("The Dreamer").
export const blockAccessibility = {
  "ACTUALIZED": {
    code: "Balanced • Future • Self",
    kidCode: "mid-high-high",
    kidName: "The Explorer",
    high:     ["Self-Reference Processing", "Pattern Recognition", "Sequential Processing"],
    moderate: ["Symbolic Manipulation", "Generative Creation", "Spatial Relationships"],
    low:      ["Social Signal Processing", "Perceptual Discrimination"]
  },
  "ALTRUISTIC": {
    code: "Abstract • Future • Other",
    kidCode: "high-high-low",
    kidName: "The Team Captain",
    high:     ["Pattern Recognition", "Social Signal Processing", "Generative Creation"],
    moderate: ["Symbolic Manipulation", "Self-Reference Processing"],
    low:      ["Sequential Processing", "Perceptual Discrimination", "Spatial Relationships"]
  },
  "ATTUNED": {
    code: "Concrete • Present • Other",
    kidCode: "low-mid-low",
    kidName: "The Friend",
    high:     ["Social Signal Processing", "Perceptual Discrimination", "Self-Reference Processing"],
    moderate: ["Sequential Processing", "Spatial Relationships"],
    low:      ["Pattern Recognition", "Generative Creation", "Symbolic Manipulation"]
  },
  "CENTERED": {
    code: "Balanced • Present • Self",
    kidCode: "mid-mid-high",
    kidName: "The Individual",
    high:     ["Self-Reference Processing", "Perceptual Discrimination", "Pattern Recognition"],
    moderate: ["Sequential Processing", "Social Signal Processing"],
    low:      ["Generative Creation", "Symbolic Manipulation"]
  },
  "COHERENT": {
    code: "Balanced • Past • Balanced",
    kidCode: "mid-low-mid",
    kidName: "The Rememberer",
    high:     ["Pattern Recognition", "Sequential Processing", "Symbolic Manipulation"],
    moderate: ["Self-Reference Processing", "Social Signal Processing", "Perceptual Discrimination"],
    low:      ["Generative Creation", "Spatial Relationships"]
  },
  "COLLABORATIVE": {
    code: "Balanced • Future • Other",
    kidCode: "mid-high-low",
    kidName: "The Guide",
    high:     ["Social Signal Processing", "Pattern Recognition", "Sequential Processing"],
    moderate: ["Spatial Relationships", "Symbolic Manipulation", "Generative Creation"],
    low:      ["Self-Reference Processing", "Perceptual Discrimination"]
  },
  "EMBODIED": {
    code: "Concrete • Present • Self",
    kidCode: "low-mid-high",
    kidName: "The Maker",
    high:     ["Perceptual Discrimination", "Spatial Relationships", "Self-Reference Processing"],
    moderate: ["Sequential Processing", "Pattern Recognition"],
    low:      ["Symbolic Manipulation", "Generative Creation", "Social Signal Processing"]
  },
  "EMPATHETIC": {
    code: "Balanced • Present • Other",
    kidCode: "mid-mid-low",
    kidName: "The Connector",
    high:     ["Social Signal Processing", "Perceptual Discrimination", "Pattern Recognition"],
    moderate: ["Sequential Processing", "Symbolic Manipulation"],
    low:      ["Self-Reference Processing", "Generative Creation"]
  },
  "EQUANIMOUS": {
    code: "Balanced • Present • Balanced",
    kidCode: "mid-mid-mid",
    kidName: "The Balanced Thinker",
    high:     ["Pattern Recognition", "Perceptual Discrimination", "Social Signal Processing"],
    moderate: ["Sequential Processing", "Symbolic Manipulation", "Self-Reference Processing"],
    low:      ["Generative Creation"]
  },
  "FORESIGHTED": {
    code: "Abstract • Future • Balanced",
    kidCode: "high-high-mid",
    kidName: "The Visionary",
    high:     ["Pattern Recognition", "Symbolic Manipulation", "Generative Creation"],
    moderate: ["Self-Reference Processing", "Social Signal Processing", "Sequential Processing"],
    low:      ["Perceptual Discrimination", "Spatial Relationships"]
  },
  "GROUNDED": {
    code: "Concrete • Present • Balanced",
    kidCode: "low-mid-mid",
    kidName: "The Observer",
    high:     ["Perceptual Discrimination", "Sequential Processing", "Social Signal Processing"],
    moderate: ["Spatial Relationships", "Self-Reference Processing"],
    low:      ["Pattern Recognition", "Generative Creation", "Symbolic Manipulation"]
  },
  "HARMONIOUS": {
    code: "Balanced • Future • Balanced",
    kidCode: "mid-high-mid",
    kidName: "The Strategist",
    high:     ["Pattern Recognition", "Spatial Relationships", "Social Signal Processing"],
    moderate: ["Sequential Processing", "Symbolic Manipulation", "Self-Reference Processing", "Generative Creation"],
    low:      ["Perceptual Discrimination"]
  },
  "IDEALIZED": {
    code: "Abstract • Past • Other",
    kidCode: "high-low-low",
    kidName: "The Storyteller",
    high:     ["Pattern Recognition", "Social Signal Processing", "Symbolic Manipulation"],
    moderate: ["Self-Reference Processing", "Sequential Processing", "Generative Creation"],
    low:      ["Perceptual Discrimination", "Spatial Relationships"]
  },
  "INTEGRATED": {
    code: "Balanced • Past • Self",
    kidCode: "mid-low-high",
    kidName: "The Collector",
    high:     ["Self-Reference Processing", "Pattern Recognition", "Sequential Processing"],
    moderate: ["Symbolic Manipulation", "Perceptual Discrimination", "Generative Creation"],
    low:      ["Social Signal Processing", "Spatial Relationships"]
  },
  "INTENTIONAL": {
    code: "Concrete • Future • Self",
    kidCode: "low-high-high",
    kidName: "The Builder",
    high:     ["Sequential Processing", "Self-Reference Processing", "Pattern Recognition"],
    moderate: ["Perceptual Discrimination", "Spatial Relationships"],
    low:      ["Social Signal Processing", "Symbolic Manipulation"]
  },
  "INTROSPECTIVE": {
    code: "Abstract • Present • Self",
    kidCode: "high-mid-high",
    kidName: "The Inventor",
    high:     ["Self-Reference Processing", "Pattern Recognition", "Symbolic Manipulation"],
    moderate: ["Generative Creation", "Spatial Relationships"],
    low:      ["Sequential Processing", "Perceptual Discrimination", "Social Signal Processing"]
  },
  "INTUITIVE": {
    code: "Abstract • Present • Other",
    kidCode: "high-mid-low",
    kidName: "The Helper",
    high:     ["Social Signal Processing", "Pattern Recognition", "Perceptual Discrimination"],
    moderate: ["Generative Creation", "Symbolic Manipulation", "Sequential Processing"],
    low:      ["Self-Reference Processing", "Spatial Relationships"]
  },
  "LEGACY": {
    code: "Concrete • Past • Other",
    kidCode: "low-low-low",
    kidName: "The Caretaker",
    high:     ["Sequential Processing", "Social Signal Processing", "Self-Reference Processing"],
    moderate: ["Pattern Recognition", "Perceptual Discrimination"],
    low:      ["Generative Creation", "Symbolic Manipulation", "Spatial Relationships"]
  },
  "MINDFUL": {
    code: "Abstract • Present • Balanced",
    kidCode: "high-mid-mid",
    kidName: "The Philosopher",
    high:     ["Pattern Recognition", "Self-Reference Processing", "Social Signal Processing"],
    moderate: ["Perceptual Discrimination", "Symbolic Manipulation", "Generative Creation"],
    low:      ["Sequential Processing", "Spatial Relationships"]
  },
  "RECONCILED": {
    code: "Balanced • Past • Other",
    kidCode: "mid-low-low",
    kidName: "The Nurturer",
    high:     ["Social Signal Processing", "Pattern Recognition", "Sequential Processing"],
    moderate: ["Perceptual Discrimination", "Symbolic Manipulation"],
    low:      ["Self-Reference Processing", "Generative Creation", "Spatial Relationships"]
  },
  "REFLECTIVE": {
    code: "Abstract • Past • Balanced",
    kidCode: "high-low-mid",
    kidName: "The Wise One",
    high:     ["Pattern Recognition", "Symbolic Manipulation", "Self-Reference Processing", "Social Signal Processing"],
    moderate: ["Sequential Processing", "Generative Creation"],
    low:      ["Perceptual Discrimination", "Spatial Relationships"]
  },
  "RELIABLE": {
    code: "Concrete • Future • Other",
    kidCode: "low-high-low",
    kidName: "The Organizer",
    high:     ["Sequential Processing", "Social Signal Processing", "Pattern Recognition"],
    moderate: ["Perceptual Discrimination", "Spatial Relationships"],
    low:      ["Self-Reference Processing", "Generative Creation"]
  },
  "RESILIENT": {
    code: "Concrete • Future • Balanced",
    kidCode: "low-high-mid",
    kidName: "The Planner",
    high:     ["Sequential Processing", "Pattern Recognition", "Perceptual Discrimination"],
    moderate: ["Self-Reference Processing", "Social Signal Processing"],
    low:      ["Generative Creation", "Symbolic Manipulation"]
  },
  "SEASONED": {
    code: "Concrete • Past • Balanced",
    kidCode: "low-low-mid",
    kidName: "The Craftsperson",
    high:     ["Perceptual Discrimination", "Sequential Processing", "Pattern Recognition"],
    moderate: ["Self-Reference Processing", "Social Signal Processing"],
    low:      ["Generative Creation", "Symbolic Manipulation"]
  },
  "SENTIMENTAL": {
    code: "Abstract • Past • Self",
    kidCode: "high-low-high",
    kidName: "The Artist",
    high:     ["Self-Reference Processing", "Pattern Recognition", "Symbolic Manipulation"],
    moderate: ["Social Signal Processing", "Generative Creation"],
    low:      ["Sequential Processing", "Perceptual Discrimination", "Spatial Relationships"]
  },
  "SHARP": {
    code: "Concrete • Past • Self",
    kidCode: "low-low-high",
    kidName: "The Expert",
    high:     ["Perceptual Discrimination", "Sequential Processing", "Self-Reference Processing"],
    moderate: ["Pattern Recognition", "Spatial Relationships"],
    low:      ["Generative Creation", "Symbolic Manipulation", "Social Signal Processing"]
  },
  "VISIONARY": {
    code: "Abstract • Future • Self",
    kidCode: "high-high-high",
    kidName: "The Dreamer",
    high:     ["Pattern Recognition", "Generative Creation", "Symbolic Manipulation"],
    moderate: ["Self-Reference Processing", "Spatial Relationships"],
    low:      ["Sequential Processing", "Perceptual Discrimination", "Social Signal Processing"]
  }
};

// Lookup: kid code (e.g. "high-high-high") → block tier object
export function getBlocksByKidCode(kidCode) {
  return Object.values(blockAccessibility).find(p => p.kidCode === kidCode) || null;
}

// Lookup: kid name (e.g. "The Dreamer") → block tier object
export function getBlocksByKidName(kidName) {
  return Object.values(blockAccessibility).find(p => p.kidName === kidName) || null;
}

// Lookup: adult name (e.g. "VISIONARY") → block tier object
export function getBlocksByAdultName(adultName) {
  return blockAccessibility[adultName.toUpperCase()] || null;
}
