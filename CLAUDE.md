# CLAUDE.md - Parser Profile Assessment System

> AI assistant guidelines for the Parser Profile cognitive typing system

## Project Overview

**Parser Profile** is a personality and cognitive processing typing system that categorizes individuals into 27 distinct profiles based on three cognitive dimensions. Developed by Cognition Blocks LLC and J.D. Mercer.

**Copyright:** 2026 Cognition Blocks LLC. All rights reserved.

## Technology Stack

- **Language:** JavaScript (ES6 modules)
- **Runtime:** Node.js / Browser compatible
- **Module System:** ES6 import/export
- **Dependencies:** None (self-contained)
- **Build Tools:** None required

## Directory Structure

```
/
├── index.js              # Main entry point - exports all profiles and lookup functions
├── README.md             # Project readme
├── CLAUDE.md             # This file
└── [27 profile modules]  # Individual profile definitions
    ├── visionary.js
    ├── sharp.js
    ├── grounded.js
    ├── attuned.js
    ├── legacy.js
    ├── embodied.js
    ├── intentional.js
    ├── resilient.js
    ├── reliable.js
    ├── integrated.js
    ├── coherent.js
    ├── reconciled.js
    ├── centered.js
    ├── equanimous.js
    ├── empathetic.js
    ├── actualized.js
    ├── harmonious.js
    ├── collaborative.js
    ├── sentimental.js
    ├── reflective.js
    ├── idealized.js
    ├── mindful.js
    ├── intuitive.js
    ├── foresighted.js
    ├── seasoned.js
    ├── introspective.js
    └── altruistic.js
```

## The Three Cognitive Dimensions

The framework uses a 3x3x3 matrix (27 combinations) based on:

### Spatial Dimension (0-100)
| Score Range | Value | Description |
|-------------|-------|-------------|
| 0-33 | Concrete | Focuses on tangible, observable reality |
| 33-66 | Balanced | Flexible between concrete and abstract |
| 66-100 | Abstract | Focuses on concepts, patterns, possibilities |

### Temporal Dimension (0-100)
| Score Range | Value | Description |
|-------------|-------|-------------|
| 0-33 | Past | References historical patterns, precedent, experience |
| 33-66 | Present | Focuses on immediate circumstances |
| 66-100 | Future | Oriented toward possibilities, predictions, outcomes |

### Reference Dimension (0-100)
| Score Range | Value | Description |
|-------------|-------|-------------|
| 0-33 | Other | Focuses on collective, external experience |
| 33-66 | Balanced | Balanced self and other consideration |
| 66-100 | Self | Focuses on personal meaning and goals |

## API Reference

### Main Entry Point (`index.js`)

```javascript
import {
  profiles,
  getProfileByScores,
  getProfileByCode,
  getProfileByName,
  PROFILE_COUNT
} from './index.js';
```

### Functions

#### `getProfileByScores(spatial, temporal, reference)`
Returns a profile based on numeric dimension scores (0-100 range).

```javascript
const profile = getProfileByScores(80, 90, 85);
// Returns: visionaryProfile (Abstract • Future • Self)
```

#### `getProfileByCode(code)`
Returns a profile by its code string.

```javascript
const profile = getProfileByCode("Abstract • Future • Self");
// Returns: visionaryProfile
```

#### `getProfileByName(name)`
Returns a profile by name (case-insensitive).

```javascript
const profile = getProfileByName("visionary");
// Returns: visionaryProfile
```

### Constants

- `PROFILE_COUNT` - Number of profiles (27)
- `profiles` - Object containing all profiles keyed by uppercase name

## Profile Module Structure

Each profile module exports a single object with the following structure:

```javascript
export const profileNameProfile = {
  // Basic Info
  "name": "PROFILE_NAME",           // Uppercase profile identifier
  "code": "Spatial • Temporal • Reference",  // Dimension code (uses bullet separator)
  "tagline": "...",                 // Short memorable descriptor

  // Narrative Sections (200-500 words each)
  "overview": "...",                // Comprehensive description
  "howYouLearn": "...",             // Learning style and environments
  "howYouCommunicate": "...",       // Communication patterns
  "phrase": "...",                  // Distilled memorable phrase
  "secret": "...",                  // Vulnerable inner experience
  "whatOthersGetWrong": "...",      // Common misperceptions
  "hiddenSuperpower": "...",        // Unique strengths
  "blindSpot": "...",               // Cognitive limitations
  "frictionPatterns": "...",        // Profile conflicts
  "energyPatterns": "...",          // Energy drains and charges
  "workEnvironments": "...",        // Ideal work contexts
  "blockIndicators": "...",         // CBI accessibility patterns

  // Structured Arrays
  "strengths": [
    {
      "title": "Strength Title",
      "description": "Description text..."
    }
    // ... 6 strengths total
  ],
  "challenges": [
    {
      "title": "Challenge Title",
      "challenge": "Description of the challenge...",
      "remedy": "Actionable guidance for addressing it..."
    }
    // ... 6 challenges total
  ]
};
```

## Code Conventions

### File Headers
Every profile file includes a standard header:
```javascript
// PROFILE_NAME Profile
// Parser Profile™ © 2026 Cognition Blocks LLC
// Spatial • Temporal • Reference
```

### Naming Conventions
- Profile exports: `{lowercaseName}Profile` (e.g., `visionaryProfile`)
- Profile names: UPPERCASE (e.g., `"VISIONARY"`)
- File names: lowercase, matching profile name (e.g., `visionary.js`)

### Code Separator
The dimension code uses bullet separators: `Spatial • Temporal • Reference`

### String Formatting
- Use double quotes for all object property values
- Narrative content includes natural line breaks for readability
- Lists in narrative sections use `-` markdown-style bullets

## Development Workflows

### Adding a New Profile

1. Create a new file `{profilename}.js` in the root directory
2. Follow the profile structure template exactly
3. Include the copyright header comment
4. Add import statement to `index.js`
5. Add to the `profiles` object in `index.js`
6. Add to the exports at the bottom of `index.js`

### Modifying a Profile

1. Locate the profile file (e.g., `visionary.js`)
2. Make changes to the desired properties
3. Ensure all required properties remain present
4. Verify the code separator format (`Spatial • Temporal • Reference`)

### Testing Profile Lookups

```javascript
import { getProfileByScores, getProfileByCode, getProfileByName } from './index.js';

// Test by scores
console.log(getProfileByScores(50, 50, 50).name); // Should return a Balanced profile

// Test by code
console.log(getProfileByCode("Balanced • Present • Balanced").name); // EQUANIMOUS

// Test by name
console.log(getProfileByName("VISIONARY").tagline);
```

## Important Notes

### CBI (Cognition Blocks Interface)
The `blockIndicators` property references the CBI accessibility system, which is part of a larger Cognition Blocks framework. Each profile includes:
- High-Accessibility Blocks
- Moderate-Accessibility Blocks
- Lower-Accessibility Blocks

### Content Volume
- Each profile contains approximately 1,500-2,000 words
- Total documentation: 40,000+ words across all profiles
- Content is psychological/narrative in nature, not code logic

### No External Dependencies
This project is intentionally self-contained with no npm packages or build tools required.

## Common Tasks

### Get all profile names
```javascript
import { profiles } from './index.js';
console.log(Object.keys(profiles));
```

### Iterate through all profiles
```javascript
import { profiles } from './index.js';
Object.values(profiles).forEach(profile => {
  console.log(`${profile.name}: ${profile.tagline}`);
});
```

### Find profiles by dimension
```javascript
import { profiles } from './index.js';

// Find all Abstract profiles
const abstractProfiles = Object.values(profiles)
  .filter(p => p.code.startsWith('Abstract'));

// Find all Future-oriented profiles
const futureProfiles = Object.values(profiles)
  .filter(p => p.code.includes('Future'));
```

## Git Workflow

- Main development branch: `main`
- Feature branches: `claude/{feature-name}-{session-id}`
- Commit messages: Clear, descriptive summaries of changes

## File Modification Checklist

When modifying this codebase:

1. [ ] Preserve copyright headers in all files
2. [ ] Maintain consistent property structure across profiles
3. [ ] Use the bullet separator (•) in dimension codes
4. [ ] Keep strengths array at 6 items
5. [ ] Keep challenges array at 6 items (each with title, challenge, remedy)
6. [ ] Update index.js if adding/removing profiles
7. [ ] Test all three lookup functions after changes
