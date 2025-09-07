

/**
 * Romanization (Revised Romanization–like, lightweight)
 * - Surname table for common family names
 * - Algorithmic per-syllable romanization for given names
 * - Keeps "Surname Given" with a space; given name syllables separated by a space
 *   e.g., 김서아 -> Kim Seo A
 */

// Common Korean surnames (most frequent + a few variants)
const SURNAME_MAP = {
  "김": "Kim",
  "이": "Lee",   // a.k.a. Yi / Rhee (simplified to Lee)
  "박": "Park",
  "최": "Choi",
  "정": "Jeong", // or Jung
  "강": "Kang",
  "조": "Cho",
  "윤": "Yoon",
  "장": "Jang",
  "임": "Lim",    // Im/Lim
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
const CHO = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"]; // ㅇ (11) -> ""
const JUNG = [
  "a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"
];
const JONG = [
  "", "k","k","ks","n","nj","nh","t","l","lk","lm","lb","ls","lt","lp","lh","m","p","ps","t","t","ng","t","t","k","t","p","t"
];

function isHangulSyllable(ch){
  const code = ch.codePointAt(0);
  return code >= 0xac00 && code <= 0xd7a3;
}

function decompose(ch){
  const code = ch.codePointAt(0) - HANGUL_BASE;
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  return { cho, jung, jong };
}

function cap(word){
  return word ? word[0].toUpperCase() + word.slice(1) : word;
}

function romanizeSyllable(ch, isWordInitial){
  if(!isHangulSyllable(ch)) return ch;
  const { cho, jung, jong } = decompose(ch);
  let ini = CHO[cho] || "";
  // ㄹ rule (initial r, final l)
  if(ini === "r" && !isWordInitial){
    // between vowels often "r", word-initial kept as r (already "r")
  }
  let vow = JUNG[jung] || "";
  let fin = JONG[jong] || "";

  // Post-processing tweaks for readability
  // Handle combinations commonly written with capitalized Y/W
  vow = vow
    .replace(/^yeo$/, "yeo")
    .replace(/^yo$/,  "yo")
    .replace(/^yu$/,  "yu")
    .replace(/^yae$/, "yae")
    .replace(/^ya$/,  "ya")
    .replace(/^wae$/, "wae")
    .replace(/^wa$/,  "wa")
    .replace(/^wi$/,  "wi")
    .replace(/^wo$/,  "wo");

  // Final consonant normalization to RR-like
  fin = fin
    .replace(/^k$/, "k")
    .replace(/^t$/, "t")
    .replace(/^p$/, "p");

  return ini + vow + fin;
}

function romanizeGiven(given){
  // Split into Hangul syllables; separate with space for clarity
  const out = [];
  let idx = 0;
  for(const ch of given){
    const r = romanizeSyllable(ch, /*wordInitial*/ idx===0);
    out.push(cap(r));
    idx++;
  }
  return out.join(" ");
}

export function romanize(fullName){
  if(!fullName) return "";
  const surname = fullName[0];
  const given = fullName.slice(1);

  // Surname mapping or fallback to algorithmic
  const surEn = SURNAME_MAP[surname] || cap(romanizeSyllable(surname, true));
  const givenEn = romanizeGiven(given);
  return `${surEn} ${givenEn}`.trim();
}

// Optional named exports if needed elsewhere
export { romanizeSyllable, romanizeGiven };