

/**
 * Deterministic seed utilities for the static client
 * - hash32: FNV-1a 32-bit hash for a string
 * - makeSeed: stable seed from multiple parts
 * - rnd: xorshift32 PRNG → returns uint32
 * - rand01: PRNG mapped to [0,1)
 * - bump: create a new deterministic seed (e.g., for “다시 생성”)
 */

/**
 * FNV-1a 32-bit string hash (deterministic across platforms)
 * @param {string} str
 * @returns {number} unsigned 32-bit
 */
export function hash32(str){
  let h = 0x811c9dc5 >>> 0; // FNV offset basis
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    // h *= 16777619 (FNV prime) using 32-bit overflow math
    h = (h + ((h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24))) >>> 0;
  }
  return h >>> 0;
}

/**
 * Join parts with a delimiter and hash to produce a stable seed
 * @param  {...(string|number|boolean|null|undefined)} parts
 * @returns {number}
 */
export function makeSeed(...parts){
  const s = parts.map(v => v==null ? '' : String(v)).join('|');
  return hash32(s);
}

/**
 * xorshift32 PRNG — returns next uint32 based on input seed
 * @param {number} seed uint32
 * @returns {number} uint32
 */
export function rnd(seed){
  let x = (seed >>> 0) || 0x12345678;
  x ^= (x << 13) >>> 0;
  x ^= (x >>> 17) >>> 0;
  x ^= (x << 5) >>> 0;
  return x >>> 0;
}

/**
 * Map PRNG output to [0,1)
 * @param {number} seed
 * @returns {number}
 */
export function rand01(seed){
  return (rnd(seed) / 0x100000000); // divide by 2^32
}

/**
 * Bump seed deterministically (useful for “다시 생성”)
 * @param {number} seed
 * @param {number} [step=1]
 * @returns {number}
 */
export function bump(seed, step=1){
  return (seed + (step >>> 0)) >>> 0;
}