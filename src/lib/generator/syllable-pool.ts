/**
 * Syllable pool management for name generation
 */

import syllablesData from '@/data/syllables.json';

export interface SyllablePool {
  mapTable: Record<string, string[]>;
  endings: string[];
  fallback: string[];
}

export interface SyllablePools {
  male: SyllablePool;
  female: SyllablePool;
}

// Default pools if data is missing
const DEFAULT_MALE: SyllablePool = {
  mapTable: {},
  endings: ['준', '현', '윤', '민'],
  fallback: ['준', '현', '민']
};

const DEFAULT_FEMALE: SyllablePool = {
  mapTable: {},
  endings: ['아', '린', '서', '연'],
  fallback: ['아', '라', '린', '서', '연']
};

function normalizePool(pool: any): SyllablePool {
  const safe = (v: any, def: any) => (Array.isArray(v) || typeof v === 'object') ? v : def;
  
  return {
    mapTable: safe(pool?.mapTable, {}),
    endings: Array.isArray(pool?.endings) ? pool.endings : DEFAULT_FEMALE.endings,
    fallback: Array.isArray(pool?.fallback) ? pool.fallback : DEFAULT_FEMALE.fallback
  };
}

// Cached pools
let _cache: SyllablePools | null = null;

export function getSyllables(): SyllablePools {
  if (_cache) return _cache;
  
  const data = syllablesData as any;
  
  _cache = {
    male: data?.male ? normalizePool(data.male) : DEFAULT_MALE,
    female: data?.female ? normalizePool(data.female) : DEFAULT_FEMALE
  };
  
  return _cache;
}

export function getPool(gender: 'male' | 'female' = 'female'): SyllablePool {
  const pools = getSyllables();
  return gender === 'male' ? pools.male : pools.female;
}

export function candidatesForSyllable(syllable: string, pool: SyllablePool): string[] {
  if (!pool) return [syllable];
  const cand = pool.mapTable?.[syllable];
  if (Array.isArray(cand) && cand.length) return cand;
  if (Array.isArray(pool.fallback) && pool.fallback.length) return pool.fallback;
  return [syllable];
}

