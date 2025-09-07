

/**
 * idols.js
 * - Load idol metadata from /data/idols.json
 * - Provide helpers to resolve idol by name (KR/EN, fuzzy)
 * - Provide suggestions for autocomplete
 */

import { loadJSON } from './loader.js';
import { levenshtein } from '../util/fuzzy.js';

let _cache = null;

/**
 * Load idols once and cache
 * Schema: [{ group: string, name_kr: string, name_en: string, gender: 'male'|'female' }]
 */
export async function getIdols(){
  if(_cache) return _cache;
  _cache = await loadJSON('./data/idols.json');
  return _cache;
}

function norm(s){
  return (s||'').toString().trim();
}

function normLower(s){
  return norm(s).toLowerCase();
}

/**
 * Exact or fuzzy resolve by input (KR or EN). Returns best match or null.
 * @param {string} input
 * @param {object} [opts]
 * @param {number} [opts.threshold=3] Maximum Levenshtein distance allowed
 */
export async function resolveIdol(input, opts={}){
  const threshold = Number.isFinite(opts.threshold) ? opts.threshold : 3;
  const idols = await getIdols();
  const q = norm(input);
  if(!q) return null;

  // 1) Exact match (KR or EN, case-insensitive for EN)
  let exact = idols.find(i => i.name_kr === q || normLower(i.name_en) === normLower(q));
  if(exact) return exact;

  // 2) Fuzzy match (choose min distance between KR/EN)
  let best = null; let bestScore = Infinity;
  const qLower = normLower(q);
  for(const i of idols){
    const s1 = levenshtein(i.name_kr, q);
    const s2 = levenshtein(normLower(i.name_en), qLower);
    const s = Math.min(s1, s2);
    if(s < bestScore){ best = i; bestScore = s; }
  }
  return (bestScore <= threshold) ? best : null;
}

/**
 * Get suggestions for an input prefix. Returns up to `limit` entries.
 * Matches KR startsWith or EN startsWith (case-insensitive), then falls back to fuzzy.
 */
export async function suggestIdols(prefix, limit=10){
  const idols = await getIdols();
  const q = norm(prefix);
  if(!q) return idols.slice(0, limit);
  const qLower = normLower(q);

  // startsWith first (KR/EN)
  const starts = idols.filter(i => i.name_kr.startsWith(q) || normLower(i.name_en).startsWith(qLower));
  if(starts.length >= limit) return starts.slice(0, limit);

  // then fuzzy rank by distance
  const ranked = idols
    .map(i => ({ i, d: Math.min(levenshtein(i.name_kr, q), levenshtein(normLower(i.name_en), qLower)) }))
    .sort((a,b) => a.d - b.d)
    .map(x => x.i);
  const merged = [...new Set([...starts, ...ranked])];
  return merged.slice(0, limit);
}