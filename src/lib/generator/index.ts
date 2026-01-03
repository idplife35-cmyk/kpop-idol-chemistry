/**
 * Generator Module Exports
 */

export { generate, inferGender, getChemistryDescription } from './engine';
export type { IdolInfo, GeneratorOptions, GeneratorResult } from './engine';

export { makeSeed, rnd, rand01, bump, hash32 } from './seed';

export { romanize, romanizeSyllable, romanizeGiven } from './romanize';

export { RELATION_PRESET, RELATION_OPTIONS, getPreset } from './style-presets';
export type { RelationType, RelationPreset } from './style-presets';

export { getSyllables, getPool, candidatesForSyllable } from './syllable-pool';
export type { SyllablePool, SyllablePools } from './syllable-pool';

export { generateDeepAnalysis, generateCoupleNames } from './analysis';

