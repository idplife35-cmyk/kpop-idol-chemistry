

/**
 * surnames.js
 * - Load Korean surnames list from /data/surnames.json
 * - Provide helper to fetch them with caching
 */

import { loadJSON } from './loader.js';

let _cache = null;

/**
 * Returns array of surnames (e.g., ["김","이","박",...])
 */
export async function getSurnames() {
  if (_cache) return _cache;
  const arr = await loadJSON('/data/surnames.json');
  _cache = Array.isArray(arr) ? arr : [];
  return _cache;
}
