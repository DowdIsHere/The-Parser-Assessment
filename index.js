// Parser Profile™ - All 27 Profiles Index
// © 2026 Cognition Blocks LLC. All rights reserved.
// Developed by J.D. Mercer

import { visionaryProfile } from './visionary.js';
import { sharpProfile } from './sharp.js';
import { groundedProfile } from './grounded.js';
import { attunedProfile } from './attuned.js';
import { legacyProfile } from './legacy.js';
import { embodiedProfile } from './embodied.js';
import { intentionalProfile } from './intentional.js';
import { resilientProfile } from './resilient.js';
import { reliableProfile } from './reliable.js';
import { integratedProfile } from './integrated.js';
import { coherentProfile } from './coherent.js';
import { reconciledProfile } from './reconciled.js';
import { centeredProfile } from './centered.js';
import { equanimousProfile } from './equanimous.js';
import { empatheticProfile } from './empathetic.js';
import { actualizedProfile } from './actualized.js';
import { harmoniousProfile } from './harmonious.js';
import { collaborativeProfile } from './collaborative.js';
import { sentimentalProfile } from './sentimental.js';
import { reflectiveProfile } from './reflective.js';
import { idealizedProfile } from './idealized.js';
import { mindfulProfile } from './mindful.js';
import { intuitiveProfile } from './intuitive.js';
import { foresightedProfile } from './foresighted.js';
import { seasonedProfile } from './seasoned.js';
import { introspectiveProfile } from './introspective.js';
import { altruisticProfile } from './altruistic.js';

// Profile lookup by name
export const profiles = {
  VISIONARY: visionaryProfile,
  SHARP: sharpProfile,
  GROUNDED: groundedProfile,
  ATTUNED: attunedProfile,
  LEGACY: legacyProfile,
  EMBODIED: embodiedProfile,
  INTENTIONAL: intentionalProfile,
  RESILIENT: resilientProfile,
  RELIABLE: reliableProfile,
  INTEGRATED: integratedProfile,
  COHERENT: coherentProfile,
  RECONCILED: reconciledProfile,
  CENTERED: centeredProfile,
  EQUANIMOUS: equanimousProfile,
  EMPATHETIC: empatheticProfile,
  ACTUALIZED: actualizedProfile,
  HARMONIOUS: harmoniousProfile,
  COLLABORATIVE: collaborativeProfile,
  SENTIMENTAL: sentimentalProfile,
  REFLECTIVE: reflectiveProfile,
  IDEALIZED: idealizedProfile,
  MINDFUL: mindfulProfile,
  INTUITIVE: intuitiveProfile,
  FORESIGHTED: foresightedProfile,
  SEASONED: seasonedProfile,
  INTROSPECTIVE: introspectiveProfile,
  ALTRUISTIC: altruisticProfile,
};

// Get profile by gradient scores
export function getProfileByScores(spatial, temporal, reference) {
  // spatial: 0-100 (0=Concrete, 50=Balanced, 100=Abstract)
  // temporal: 0-100 (0=Past, 50=Present, 100=Future)
  // reference: 0-100 (0=Other, 50=Balanced, 100=Self)
  
  const s = spatial < 33 ? 'Concrete' : spatial > 66 ? 'Abstract' : 'Balanced';
  const t = temporal < 33 ? 'Past' : temporal > 66 ? 'Future' : 'Present';
  const r = reference < 33 ? 'Other' : reference > 66 ? 'Self' : 'Balanced';
  
  const code = `${s} • ${t} • ${r}`;
  
  return Object.values(profiles).find(p => p.code === code) || null;
}

// Get profile by code string
export function getProfileByCode(code) {
  return Object.values(profiles).find(p => p.code === code) || null;
}

// Get profile by name
export function getProfileByName(name) {
  return profiles[name.toUpperCase()] || null;
}

// Export count for verification
export const PROFILE_COUNT = Object.keys(profiles).length;

// Export all individually
export {
  visionaryProfile,
  sharpProfile,
  groundedProfile,
  attunedProfile,
  legacyProfile,
  embodiedProfile,
  intentionalProfile,
  resilientProfile,
  reliableProfile,
  integratedProfile,
  coherentProfile,
  reconciledProfile,
  centeredProfile,
  equanimousProfile,
  empatheticProfile,
  actualizedProfile,
  harmoniousProfile,
  collaborativeProfile,
  sentimentalProfile,
  reflectiveProfile,
  idealizedProfile,
  mindfulProfile,
  intuitiveProfile,
  foresightedProfile,
  seasonedProfile,
  introspectiveProfile,
  altruisticProfile,
};
