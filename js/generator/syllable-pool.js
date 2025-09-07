// /js/generator/syllable-pool.js
// Load & manage syllable pools for male/female name styling

import { loadJSON } from '../data/loader.js';

let _cache = null;

/**
 * 내부 유효성 검사: mapTable/endings/fallback 기본값 보강
 */
function normalizePool(pool) {
  const safe = (v, def) => (Array.isArray(v) || typeof v === 'object') ? v : def;

  const male = pool?.male || {};
  const female = pool?.female || {};

  const m = {
    mapTable: safe(male.mapTable, {}),
    endings:  Array.isArray(male.endings)  ? male.endings  : ['준','현','윤','민'],
    fallback: Array.isArray(male.fallback) ? male.fallback : ['준','현','민']
  };

  const f = {
    mapTable: safe(female.mapTable, {}),
    endings:  Array.isArray(female.endings)  ? female.endings  : ['아','린','서','연'],
    fallback: Array.isArray(female.fallback) ? female.fallback : ['아','라','린','서','연']
  };

  return { male: m, female: f };
}

/**
 * syllables.json을 1회 로드 후 캐시
 * 구조 예:
 * {
 *   "male":   { "mapTable": { "민":[...], ... }, "endings":[...], "fallback":[...] },
 *   "female": { "mapTable": { "민":[...], ... }, "endings":[...], "fallback":[...] }
 * }
 */
export async function getSyllables() {
  if (_cache) return _cache;
  const raw = await loadJSON('./data/syllables.json');
  _cache = normalizePool(raw || {});
  return _cache;
}

/**
 * 성별에 맞는 풀 반환 (기본: female)
 * @param {'male'|'female'} gender
 */
export async function getPool(gender = 'female') {
  const pools = await getSyllables();
  return gender === 'male' ? pools.male : pools.female;
}

/**
 * 안전한 후보 추출 유틸
 * - 특정 음절이 mapTable에 없을 때 fallback 사용
 * - 비어 있으면 기본 문자열 배열 반환
 */
export function candidatesForSyllable(syllable, pool) {
  if (!pool) return [syllable];
  const cand = pool.mapTable?.[syllable];
  if (Array.isArray(cand) && cand.length) return cand;
  if (Array.isArray(pool.fallback) && pool.fallback.length) return pool.fallback;
  return [syllable];
}