// Public directory of the 27 Parser archetypes. Used by the marketing-facing
// /parsers index and detail pages (no auth required). Full profile bodies are
// loaded on demand from the root profile modules via lib/profiles.ts.

export interface ParserSummary {
  slug: string
  name: string
  code: string
  tagline: string
}

export const PARSERS: ParserSummary[] = [
  { slug: 'actualized', name: 'ACTUALIZED', code: 'Balanced • Future • Self', tagline: "The one who builds toward who they're becoming" },
  { slug: 'altruistic', name: 'ALTRUISTIC', code: 'Abstract • Future • Other', tagline: "The one who sees what we could become together" },
  { slug: 'attuned', name: 'ATTUNED', code: 'Concrete • Present • Other', tagline: "The one who felt the room before anyone said a word" },
  { slug: 'centered', name: 'CENTERED', code: 'Balanced • Present • Self', tagline: "The one who knows where they stand" },
  { slug: 'coherent', name: 'COHERENT', code: 'Balanced • Past • Balanced', tagline: "The one who finds the thread that connects everything" },
  { slug: 'collaborative', name: 'COLLABORATIVE', code: 'Balanced • Future • Other', tagline: "The one who sees what we could build together" },
  { slug: 'embodied', name: 'EMBODIED', code: 'Concrete • Present • Self', tagline: "The one who lives in the body others merely inhabit" },
  { slug: 'empathetic', name: 'EMPATHETIC', code: 'Balanced • Present • Other', tagline: "The one who feels what others can't express" },
  { slug: 'equanimous', name: 'EQUANIMOUS', code: 'Balanced • Present • Balanced', tagline: "The stable center who holds steady when everything else shakes" },
  { slug: 'foresighted', name: 'FORESIGHTED', code: 'Abstract • Future • Balanced', tagline: "The one who sees where things are heading" },
  { slug: 'grounded', name: 'GROUNDED', code: 'Concrete • Present • Balanced', tagline: "The one who sees what's actually there" },
  { slug: 'harmonious', name: 'HARMONIOUS', code: 'Balanced • Future • Balanced', tagline: "The one who sees how everything could fit together" },
  { slug: 'idealized', name: 'IDEALIZED', code: 'Abstract • Past • Other', tagline: "The one who remembers what we were supposed to be" },
  { slug: 'integrated', name: 'INTEGRATED', code: 'Balanced • Past • Self', tagline: "The one who knows themselves because they've done the work" },
  { slug: 'intentional', name: 'INTENTIONAL', code: 'Concrete • Future • Self', tagline: "The one who's already building what others are still wishing for" },
  { slug: 'introspective', name: 'INTROSPECTIVE', code: 'Abstract • Present • Self', tagline: "The one who observes their own consciousness" },
  { slug: 'intuitive', name: 'INTUITIVE', code: 'Abstract • Present • Other', tagline: "The one who knows before being told" },
  { slug: 'legacy', name: 'LEGACY', code: 'Concrete • Past • Other', tagline: "The one who remembers what it cost to build this" },
  { slug: 'mindful', name: 'MINDFUL', code: 'Abstract • Present • Balanced', tagline: "The one who sees the texture of now" },
  { slug: 'reconciled', name: 'RECONCILED', code: 'Balanced • Past • Other', tagline: "The one who holds what groups need to remember" },
  { slug: 'reflective', name: 'REFLECTIVE', code: 'Abstract • Past • Balanced', tagline: "The one who finds patterns in what has been" },
  { slug: 'reliable', name: 'RELIABLE', code: 'Concrete • Future • Other', tagline: "The one whose word is architecture" },
  { slug: 'resilient', name: 'RESILIENT', code: 'Concrete • Future • Balanced', tagline: "The one who's already prepared for what others don't see coming" },
  { slug: 'seasoned', name: 'SEASONED', code: 'Concrete • Past • Balanced', tagline: "The one who's already paid the tuition" },
  { slug: 'sentimental', name: 'SENTIMENTAL', code: 'Abstract • Past • Self', tagline: "The one who transforms memory into meaning" },
  { slug: 'sharp', name: 'SHARP', code: 'Concrete • Past • Self', tagline: "The one who remembers what actually happened" },
  { slug: 'visionary', name: 'VISIONARY', code: 'Abstract • Future • Self', tagline: "The one who sees where things are going before anyone else" },
]

export function getParserSummary(slug: string): ParserSummary | undefined {
  return PARSERS.find((p) => p.slug === slug)
}
