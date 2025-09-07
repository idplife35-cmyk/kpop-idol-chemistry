
/**
 * fuzzy.js — tiny fuzzy matching helpers for the static app
 * - levenshtein(a,b): edit distance
 * - similarity(a,b): 0..1 score from Levenshtein
 * - bestMatch(query, candidates, {accessor, threshold}): pick best candidate
 */

/**
 * Safe string normalize for matching
 */
function norm(s){
  return (s==null ? '' : String(s))
    .trim()
    .toLowerCase();
}

/**
 * Classic Levenshtein distance (iterative DP)
 * @param {string} a
 * @param {string} b
 * @returns {number} distance >= 0
 */
export function levenshtein(a, b){
  a = a ?? ''; b = b ?? '';
  if(a === b) return 0;
  const m = a.length, n = b.length;
  if(m === 0) return n; if(n === 0) return m;
  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for(let j=0; j<=n; j++) prev[j] = j;
  for(let i=1; i<=m; i++){
    curr[0] = i;
    const ca = a.charCodeAt(i-1);
    for(let j=1; j<=n; j++){
      const cost = (ca === b.charCodeAt(j-1)) ? 0 : 1;
      const del = prev[j] + 1;
      const ins = curr[j-1] + 1;
      const sub = prev[j-1] + cost;
      curr[j] = del < ins ? (del < sub ? del : sub) : (ins < sub ? ins : sub);
    }
    // swap
    for(let j=0; j<=n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

/**
 * Convert Levenshtein distance to similarity 0..1
 */
export function similarity(a, b){
  const A = norm(a), B = norm(b);
  const d = levenshtein(A, B);
  const maxLen = Math.max(A.length, B.length) || 1;
  return 1 - (d / maxLen);
}

/**
 * Find best match among candidates.
 * @param {string} query
 * @param {Array} candidates (array of strings or objects)
 * @param {object} [opts]
 * @param {(x:any)=>string} [opts.accessor] return string for each candidate
 * @param {number} [opts.threshold=3] max allowed edit distance (Levenshtein)
 * @returns {{index:number, item:any, distance:number}|null}
 */
export function bestMatch(query, candidates, opts={}){
  const threshold = Number.isFinite(opts.threshold) ? opts.threshold : 3;
  const acc = typeof opts.accessor === 'function' ? opts.accessor : (x)=>x;
  const q = norm(query);
  if(!q || !Array.isArray(candidates) || candidates.length===0) return null;

  let bestIdx = -1, bestDist = Infinity;
  for(let i=0;i<candidates.length;i++){
    const s = norm(acc(candidates[i]));
    const d = levenshtein(q, s);
    if(d < bestDist){ bestDist = d; bestIdx = i; }
  }
  if(bestIdx === -1 || bestDist > threshold) return null;
  return { index: bestIdx, item: candidates[bestIdx], distance: bestDist };
}