// Parser Profile™ - All 27 Profiles Index
// © 2026 Cognition Blocks LLC. All rights reserved.
// Developed by J.D. Mercer

// Import from grouped profile files
import {
  actualizedProfile,
  altruisticProfile,
  attunedProfile,
  centeredProfile,
  coherentProfile,
  collaborativeProfile,
  embodiedProfile,
} from './profiles-group-1.js';

import {
  empatheticProfile,
  equanimousProfile,
  foresightedProfile,
  groundedProfile,
  harmoniousProfile,
  idealizedProfile,
  integratedProfile,
} from './profiles-group-2.js';

import {
  intentionalProfile,
  introspectiveProfile,
  intuitiveProfile,
  legacyProfile,
  mindfulProfile,
  reconciledProfile,
  reflectiveProfile,
} from './profiles-group-3.js';

import {
  reliableProfile,
  resilientProfile,
  seasonedProfile,
  sentimentalProfile,
  sharpProfile,
  visionaryProfile,
} from './profiles-group-4.js';

// Young Adult (18–29 / "early" life stage) profile variants.
// Every archetype now has a dedicated YA variant; getProfileForStage()
// returns it for the 'early' life stage.
import { actualizedyaProfile } from './actualizedya.js';
import { altruisticyaProfile } from './altruisticya.js';
import { attunedyaProfile } from './attunedya.js';
import { centeredyaProfile } from './centeredya.js';
import { coherentyaProfile } from './coherentya.js';
import { collaborativeyaProfile } from './collaborativeya.js';
import { embodiedyaProfile } from './embodiedya.js';
import { empatheticyaProfile } from './empatheticya.js';
import { equanimousyaProfile } from './equanimousya.js';
import { foresightedyaProfile } from './foresightedya.js';
import { groundedyaProfile } from './groundedya.js';
import { harmoniousyaProfile } from './harmoniousya.js';
import { idealizedyaProfile } from './idealizedya.js';
import { integratedyaProfile } from './integratedya.js';
import { intentionalyaProfile } from './intentionalya.js';
import { introspectiveyaProfile } from './introspectiveya.js';
import { intuitiveyaProfile } from './intuitiveya.js';
import { legacyyaProfile } from './legacyya.js';
import { mindfulyaProfile } from './mindfulya.js';
import { reconciledyaProfile } from './reconciledya.js';
import { reflectiveyaProfile } from './reflectiveya.js';
import { reliableyaProfile } from './reliableya.js';
import { resilientyaProfile } from './resilientya.js';
import { seasonedyaProfile } from './seasonedya.js';
import { sentimentalyaProfile } from './sentimentalya.js';
import { sharpyaProfile } from './sharpya.js';
import { visionaryyaProfile } from './visionaryya.js';

const youngAdultProfiles = {
  ACTUALIZED: actualizedyaProfile,
  ALTRUISTIC: altruisticyaProfile,
  ATTUNED: attunedyaProfile,
  CENTERED: centeredyaProfile,
  COHERENT: coherentyaProfile,
  COLLABORATIVE: collaborativeyaProfile,
  EMBODIED: embodiedyaProfile,
  EMPATHETIC: empatheticyaProfile,
  EQUANIMOUS: equanimousyaProfile,
  FORESIGHTED: foresightedyaProfile,
  GROUNDED: groundedyaProfile,
  HARMONIOUS: harmoniousyaProfile,
  IDEALIZED: idealizedyaProfile,
  INTEGRATED: integratedyaProfile,
  INTENTIONAL: intentionalyaProfile,
  INTROSPECTIVE: introspectiveyaProfile,
  INTUITIVE: intuitiveyaProfile,
  LEGACY: legacyyaProfile,
  MINDFUL: mindfulyaProfile,
  RECONCILED: reconciledyaProfile,
  REFLECTIVE: reflectiveyaProfile,
  RELIABLE: reliableyaProfile,
  RESILIENT: resilientyaProfile,
  SEASONED: seasonedyaProfile,
  SENTIMENTAL: sentimentalyaProfile,
  SHARP: sharpyaProfile,
  VISIONARY: visionaryyaProfile,
};

// Profile lookup by name
export const profiles = {
  ACTUALIZED: actualizedProfile,
  ALTRUISTIC: altruisticProfile,
  ATTUNED: attunedProfile,
  CENTERED: centeredProfile,
  COHERENT: coherentProfile,
  COLLABORATIVE: collaborativeProfile,
  EMBODIED: embodiedProfile,
  EMPATHETIC: empatheticProfile,
  EQUANIMOUS: equanimousProfile,
  FORESIGHTED: foresightedProfile,
  GROUNDED: groundedProfile,
  HARMONIOUS: harmoniousProfile,
  IDEALIZED: idealizedProfile,
  INTEGRATED: integratedProfile,
  INTENTIONAL: intentionalProfile,
  INTROSPECTIVE: introspectiveProfile,
  INTUITIVE: intuitiveProfile,
  LEGACY: legacyProfile,
  MINDFUL: mindfulProfile,
  RECONCILED: reconciledProfile,
  REFLECTIVE: reflectiveProfile,
  RELIABLE: reliableProfile,
  RESILIENT: resilientProfile,
  SEASONED: seasonedProfile,
  SENTIMENTAL: sentimentalProfile,
  SHARP: sharpProfile,
  VISIONARY: visionaryProfile,
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

// Get profile by name for a given life stage.
// lifeStage 'early' (young adult, 18–29) returns the YA variant when one
// exists; otherwise it falls back to the standard profile.
export function getProfileForStage(name, lifeStage) {
  const key = name.toUpperCase();
  if (lifeStage === 'early' && youngAdultProfiles[key]) {
    return youngAdultProfiles[key];
  }
  return profiles[key] || null;
}

// Export count for verification
export const PROFILE_COUNT = Object.keys(profiles).length;

// Export all individually
export {
  actualizedProfile,
  altruisticProfile,
  attunedProfile,
  centeredProfile,
  coherentProfile,
  collaborativeProfile,
  embodiedProfile,
  empatheticProfile,
  equanimousProfile,
  foresightedProfile,
  groundedProfile,
  harmoniousProfile,
  idealizedProfile,
  integratedProfile,
  intentionalProfile,
  introspectiveProfile,
  intuitiveProfile,
  legacyProfile,
  mindfulProfile,
  reconciledProfile,
  reflectiveProfile,
  reliableProfile,
  resilientProfile,
  seasonedProfile,
  sentimentalProfile,
  sharpProfile,
  visionaryProfile,
};
