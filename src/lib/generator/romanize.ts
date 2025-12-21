/**
 * Romanization (Revised Romanization–like, lightweight)
 * - Surname table for common family names
 * - Algorithmic per-syllable romanization for given names
 */

// Common Korean surnames
const SURNAME_MAP: Record<string, string> = {
  "김": "Kim",
  "이": "Lee",
  "박": "Park",
  "최": "Choi",
  "정": "Jeong",
  "강": "Kang",
  "조": "Cho",
  "윤": "Yoon",
  "장": "Jang",
  "임": "Lim",
  "오": "Oh",
  "한": "Han",
  "서": "Seo",
  "신": "Shin",
  "배": "Bae",
  "문": "Moon",
  "권": "Kwon",
  "유": "Yoo",
  "홍": "Hong",
  "전": "Jeon",
  "남": "Nam",
  "노": "Roh",
  "류": "Ryu",
  "하": "Ha"
};

// Hangul decomposition constants
const HANGUL_BASE = 0xac00;
const CHO = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
const JUNG = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"
];
const JONG = [
  "", "k", "k", "ks", "n", "nj", "nh", "t", "l", "lk", "lm", "lb", "ls", "lt", "lp", "lh", "m", "p", "ps", "t", "t", "ng", "t", "t", "k", "t", "p", "t"
];

function isHangulSyllable(ch: string): boolean {
  const code = ch.codePointAt(0) || 0;
  return code >= 0xac00 && code <= 0xd7a3;
}

function decompose(ch: string): { cho: number; jung: number; jong: number } {
  const code = (ch.codePointAt(0) || 0) - HANGUL_BASE;
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  return { cho, jung, jong };
}

function cap(word: string): string {
  return word ? word[0].toUpperCase() + word.slice(1) : word;
}

function romanizeSyllable(ch: string, isWordInitial: boolean): string {
  if (!isHangulSyllable(ch)) return ch;
  const { cho, jung, jong } = decompose(ch);
  const ini = CHO[cho] || "";
  const vow = JUNG[jung] || "";
  const fin = JONG[jong] || "";
  return ini + vow + fin;
}

function romanizeGiven(given: string): string {
  const out: string[] = [];
  let idx = 0;
  for (const ch of given) {
    const r = romanizeSyllable(ch, idx === 0);
    out.push(cap(r));
    idx++;
  }
  return out.join(" ");
}

export function romanize(fullName: string): string {
  if (!fullName) return "";
  const surname = fullName[0];
  const given = fullName.slice(1);

  // Surname mapping or fallback to algorithmic
  const surEn = SURNAME_MAP[surname] || cap(romanizeSyllable(surname, true));
  const givenEn = romanizeGiven(given);
  return `${surEn} ${givenEn}`.trim();
}

export { romanizeSyllable, romanizeGiven };

