/**
 * Name Generation Engine
 * Core logic for generating Korean names with chemistry scores
 */

import { makeSeed, rnd } from './seed';
import { romanize } from './romanize';
import { RELATION_PRESET, type RelationType } from './style-presets';
import { getSyllables, type SyllablePool } from './syllable-pool';
import surnamesData from '@/data/surnames.json';

export interface IdolInfo {
  group: string;
  name_kr: string;
  name_en: string;
  gender: 'male' | 'female';
}

export interface GeneratorOptions {
  myName: string;
  idol: IdolInfo;
  genderPref?: 'auto' | 'male' | 'female';
  relation?: RelationType;
}

export interface GeneratorResult {
  seed: number;
  finalGender: 'male' | 'female';
  chemistry: number;
  sameName: {
    full_kr: string;
    full_en: string;
  };
  styled: {
    full_kr: string;
    full_en: string;
  };
}

// Get surnames from JSON
function getSurnames(): string[] {
  return surnamesData as string[];
}

// Infer gender from name
export function inferGender(myName: string): 'male' | 'female' | null {
  if (!myName) return null;
  
  const n = (myName || '').toLowerCase();
  const female = ['sophia', 'emma', 'olivia', 'ava', 'mia', 'isabella', 'sofia', 'emily', 'chloe', 'grace'];
  const male = ['daniel', 'david', 'michael', 'james', 'john', 'william', 'henry', 'liam', 'noah'];
  
  if (female.includes(n)) return 'female';
  if (male.includes(n)) return 'male';
  
  // Korean name detection
  if (/[가-힣]$/.test(myName)) {
    const last = myName[myName.length - 1];
    if ('아라연린예윤서나'.includes(last)) return 'female';
    if ('준현석태호민우'.includes(last)) return 'male';
  }
  
  return null;
}

// Helper functions
function pick<T>(arr: T[], n: number): T {
  return arr[n % arr.length];
}

function splitHangul(str: string): string[] {
  return [...str];
}

function mapSyllable(sy: string, pool: SyllablePool, n: number): string {
  const table = pool.mapTable || {};
  const cand = table[sy] || pool.fallback || [sy];
  return cand[n % cand.length];
}

function styleFrom(
  given: string, 
  pool: SyllablePool, 
  preset: typeof RELATION_PRESET.lover, 
  n: number
): string {
  const parts = splitHangul(given);
  let out = parts.map((sy, i) => mapSyllable(sy, pool, n + i));
  
  const target = preset.targetLen.includes(3) && (n % 10 < 4) ? 3 : preset.targetLen[0];
  
  while (out.length < target) {
    out.push(pick(pool.endings, n + out.length));
  }
  
  if (out.length > 3) {
    out = out.slice(0, 3);
  }
  
  // Avoid consecutive same syllables
  for (let i = 1; i < out.length; i++) {
    if (out[i] === out[i - 1]) {
      out[i] = pick(pool.endings, n + i);
    }
  }
  
  return out.join('');
}

/**
 * Main generation function
 */
export function generate(options: GeneratorOptions): GeneratorResult {
  const { myName, idol, genderPref = 'auto', relation = 'lover' } = options;
  
  // Create deterministic seed
  const seed = makeSeed(myName || '', idol.group + ':' + idol.name_kr, genderPref, relation);
  
  // Determine final gender
  const finalGender: 'male' | 'female' = 
    genderPref !== 'auto' 
      ? genderPref 
      : inferGender(myName) || idol.gender || 'female';
  
  // Get data
  const surnames = getSurnames();
  const syllables = getSyllables();
  
  // Generate random numbers
  const n1 = rnd(seed);
  const n2 = rnd(seed + 1);
  const n3 = rnd(seed + 2);
  const n4 = rnd(seed + 3);
  
  // Same Name (surname + idol's given name)
  const surname1 = pick(surnames, n1);
  const full1_kr = surname1 + idol.name_kr;
  const full1_en = romanize(full1_kr);
  
  // Styled Name (generated based on relation)
  const pool = finalGender === 'female' ? syllables.female : syllables.male;
  const preset = RELATION_PRESET[relation] || RELATION_PRESET.lover;
  const given2 = styleFrom(idol.name_kr, pool, preset, n2);
  const surname2 = pick(surnames, n3);
  const full2_kr = surname2 + given2;
  const full2_en = romanize(full2_kr);
  
  // Chemistry score (70-100)
  const chemistry = 70 + (n4 % 31);
  
  return {
    seed,
    finalGender,
    chemistry,
    sameName: { full_kr: full1_kr, full_en: full1_en },
    styled: { full_kr: full2_kr, full_en: full2_en }
  };
}

/**
 * Get chemistry description based on score
 */
export function getChemistryDescription(score: number): { emoji: string; text: string; color: string } {
  if (score >= 95) return { emoji: '💘', text: 'Perfect Match!', color: '#FF2E8B' };
  if (score >= 90) return { emoji: '💖', text: 'Amazing Chemistry!', color: '#FF6B9D' };
  if (score >= 85) return { emoji: '💕', text: 'Great Match!', color: '#FF8FB1' };
  if (score >= 80) return { emoji: '💗', text: 'Good Chemistry!', color: '#FFB3C6' };
  return { emoji: '💜', text: 'Nice Match!', color: '#B490FF' };
}

