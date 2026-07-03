// Utility to dynamically import a parser profile by name and life stage.
// The profile JS files are CommonJS modules in the repo root.
// We use dynamic require() here since these are legacy JS files.

export type LifeStage = 'adult' | 'ya' | 'teens' | 'kids'

const profileModuleMap: Record<string, Record<LifeStage, string>> = {
  actualized:    { adult: '../actualized.js',    ya: '../actualizedya.js',    teens: '../actualizedteens.js',    kids: '../actualizedkids.js' },
  altruistic:    { adult: '../altruistic.js',    ya: '../altruisticya.js',    teens: '../altruisticteens.js',    kids: '../altruistickids.js' },
  attuned:       { adult: '../attuned.js',       ya: '../attunedya.js',       teens: '../attunedteens.js',       kids: '../attunedkids.js' },
  centered:      { adult: '../centered.js',      ya: '../centeredya.js',      teens: '../centeredteens.js',      kids: '../centeredkids.js' },
  coherent:      { adult: '../coherent.js',      ya: '../coherentya.js',      teens: '../coherentteens.js',      kids: '../coherentkids.js' },
  collaborative: { adult: '../collaborative.js', ya: '../collaborativeya.js', teens: '../collaborativeteens.js', kids: '../collaborativekids.js' },
  embodied:      { adult: '../embodied.js',      ya: '../embodiedya.js',      teens: '../embodiedteens.js',      kids: '../embodiedkids.js' },
  empathetic:    { adult: '../empathetic.js',    ya: '../empatheticya.js',    teens: '../empatheticteens.js',    kids: '../empathetickids.js' },
  equanimous:    { adult: '../equanimous.js',    ya: '../equanimousya.js',    teens: '../equanimousteens.js',    kids: '../equanimouskids.js' },
  foresighted:   { adult: '../foresighted.js',   ya: '../foresightedya.js',   teens: '../foresightedteens.js',   kids: '../foresightedkids.js' },
  grounded:      { adult: '../grounded.js',      ya: '../groundedya.js',      teens: '../groundedteens.js',      kids: '../groundedkids.js' },
  harmonious:    { adult: '../harmonious.js',    ya: '../harmoniousya.js',    teens: '../harmoniousteens.js',    kids: '../harmoniouskids.js' },
  idealized:     { adult: '../idealized.js',     ya: '../idealizedya.js',     teens: '../idealizedteens.js',     kids: '../idealizedkids.js' },
  integrated:    { adult: '../integrated.js',    ya: '../integratedya.js',    teens: '../integratedteens.js',    kids: '../integratedkids.js' },
  intentional:   { adult: '../intentional.js',   ya: '../intentionalya.js',   teens: '../intentionalteens.js',   kids: '../intentionalkids.js' },
  introspective: { adult: '../introspective.js', ya: '../introspectiveya.js', teens: '../introspectiveteens.js', kids: '../introspectivekids.js' },
  intuitive:     { adult: '../intuitive.js',     ya: '../intuitiveya.js',     teens: '../intuitiveteens.js',     kids: '../intuitivekids.js' },
  legacy:        { adult: '../legacy.js',        ya: '../legacyya.js',        teens: '../legacyteens.js',        kids: '../legacykids.js' },
  mindful:       { adult: '../mindful.js',       ya: '../mindfulya.js',       teens: '../mindfulteens.js',       kids: '../mindfulkids.js' },
  reconciled:    { adult: '../reconciled.js',    ya: '../reconciledya.js',    teens: '../reconciledteens.js',    kids: '../reconciledkids.js' },
  reflective:    { adult: '../reflective.js',    ya: '../reflectiveya.js',    teens: '../reflectiveteens.js',    kids: '../reflectivekids.js' },
  reliable:      { adult: '../reliable.js',      ya: '../reliableya.js',      teens: '../reliableteens.js',      kids: '../reliablekids.js' },
  resilient:     { adult: '../resilient.js',     ya: '../resilientya.js',     teens: '../resilientteens.js',     kids: '../resilientkids.js' },
  seasoned:      { adult: '../seasoned.js',      ya: '../seasonedya.js',      teens: '../seasonedteens.js',      kids: '../seasonedkids.js' },
  sentimental:   { adult: '../sentimental.js',   ya: '../sentimentalya.js',   teens: '../sentimentalteens.js',   kids: '../sentimentalkids.js' },
  sharp:         { adult: '../sharp.js',         ya: '../sharpya.js',         teens: '../sharpteens.js',         kids: '../sharpkids.js' },
  visionary:     { adult: '../visionary.js',     ya: '../visionaryya.js',     teens: '../visionaryteens.js',     kids: '../visionarykids.js' },
}

export function getProfileData(name: string, stage: LifeStage = 'adult'): any | null {
  if (!name) return null
  const key = name.toLowerCase().trim()
  const paths = profileModuleMap[key]
  if (!paths) return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(paths[stage])
    // Each module exports one named export e.g. visionaryProfile, visionaryKidsProfile
    const exports = Object.values(mod)
    return exports[0] ?? null
  } catch {
    return null
  }
}
