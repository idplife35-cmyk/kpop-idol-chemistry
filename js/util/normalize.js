

/**
 * normalize.js
 * Lightweight input normalizers for the static app
 * - NFC normalization (Hangul compose)
 * - Whitespace collapse & trim
 * - Emoji/control removal (optional)
 * - Safe filtering for names (Latin/Hangul + a few punctuation)
 */

/**
 * Unicode NFC normalize (Hangul compose)
 */
export function toNFC(str){
  try { return (str ?? '').normalize('NFC'); } catch { return String(str ?? ''); }
}

/**
 * Collapse consecutive whitespace to single spaces and trim
 */
export function collapseSpaces(str){
  return String(str ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Remove basic emoji & control characters
 * (keeps common punctuation and letters)
 */
export function removeEmojiAndControls(str){
  if(!str) return '';
  // Remove C0/C1 controls (except tab/newline which are collapsed later)
  let s = str.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  // Remove a broad range of emoji blocks (BMP + some astral ranges)
  s = s
    // Misc symbols & dingbats, arrows, etc.
    .replace(/[\u2000-\u206F]/g, '')
    .replace(/[\u2190-\u21FF]/g, '')
    .replace(/[\u2300-\u27BF]/g, '')
    .replace(/[\u2B00-\u2BFF]/g, '')
    // Emoticons, transport/map, supplemental symbols (surrogate pairs)
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
  return s;
}

/**
 * Keep only safe name characters: Hangul, Latin letters, spaces, hyphen, apostrophe, period
 */
export function keepNameSafeChars(str){
  return String(str ?? '').replace(/[^A-Za-z\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F .\-'`]/g, '');
}

/**
 * Clip to a max length (grapheme naive)
 */
export function clipLength(str, max=40){
  const s = String(str ?? '');
  return s.length > max ? s.slice(0, max) : s;
}

/**
 * Full pipeline for generic user-entered names
 */
export function normalizeUserName(input){
  let s = toNFC(input);
  s = removeEmojiAndControls(s);
  s = collapseSpaces(s);
  s = keepNameSafeChars(s);
  s = collapseSpaces(s);
  s = clipLength(s, 40);
  return s;
}

/**
 * Full pipeline for idol field (a little more permissive: allows digits)
 */
export function normalizeIdolInput(input){
  let s = toNFC(input);
  s = removeEmojiAndControls(s);
  s = collapseSpaces(s);
  // allow digits for group names like "2AM", "4Minute"
  s = String(s).replace(/[^0-9A-Za-z\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F .\-'`]/g, '');
  s = collapseSpaces(s);
  s = clipLength(s, 48);
  return s;
}

/**
 * Heuristic script detection (basic)
 */
export function detectScript(str){
  const s = String(str ?? '');
  if(/[\uAC00-\uD7A3]/.test(s)) return 'hangul';
  if(/[A-Za-z]/.test(s)) return 'latin';
  return 'other';
}