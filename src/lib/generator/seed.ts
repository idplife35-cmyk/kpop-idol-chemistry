/**
 * Deterministic seed utilities
 * - hash32: FNV-1a 32-bit hash for a string
 * - makeSeed: stable seed from multiple parts
 * - rnd: xorshift32 PRNG → returns uint32
 * - rand01: PRNG mapped to [0,1)
 * - bump: create a new deterministic seed
 */

/**
 * FNV-1a 32-bit string hash (deterministic across platforms)
 */
export function hash32(str: string): number {
  let h = 0x811c9dc5 >>> 0; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    // h *= 16777619 (FNV prime) using 32-bit overflow math
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

/**
 * Join parts with a delimiter and hash to produce a stable seed
 */
export function makeSeed(...parts: (string | number | boolean | null | undefined)[]): number {
  const s = parts.map(v => v == null ? '' : String(v)).join('|');
  return hash32(s);
}

/**
 * xorshift32 PRNG — returns next uint32 based on input seed
 */
export function rnd(seed: number): number {
  let x = (seed >>> 0) || 0x12345678;
  x ^= (x << 13) >>> 0;
  x ^= (x >>> 17) >>> 0;
  x ^= (x << 5) >>> 0;
  return x >>> 0;
}

/**
 * Map PRNG output to [0,1)
 */
export function rand01(seed: number): number {
  return rnd(seed) / 0x100000000; // divide by 2^32
}

/**
 * Bump seed deterministically (useful for "다시 생성")
 */
export function bump(seed: number, step: number = 1): number {
  return (seed + (step >>> 0)) >>> 0;
}

