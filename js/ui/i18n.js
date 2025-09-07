

/**
 * i18n.js — minimal internationalization helpers
 * Provides labels and copy templates for Korean (ko) and English (en).
 * You can extend to other languages by adding entries to DICT/RELATION_LABELS/COPY_TEMPLATES.
 */

export const SUPPORTED_LANGS = ["ko", "en"]; // extend as needed (e.g., "es")

// Generic labels used across the UI
export const DICT = {
  ko: {
    header_myName: "💖 당신의 이름: {{name}}",
    header_idol: "🎤 좋아하는 아이돌: {{idol}} ({{group}})",
    label_romanized: "영문 표기",
    label_chemistry: "케미 지수",
    label_comment: "코멘트"
  },
  en: {
    header_myName: "💖 Your name: {{name}}",
    header_idol: "🎤 Favorite idol: {{idol}} ({{group}})",
    label_romanized: "Romanization",
    label_chemistry: "Chemistry",
    label_comment: "Comment"
  }
};

// Relation labels per language
export const RELATION_LABELS = {
  ko: {
    friend: "어울리는 절친 이름",
    partner: "어울리는 무대 파트너 이름",
    classmate: "어울리는 같은 반 친구 이름",
    drama: "드라마 속 주인공 이름",
    lover: "어울리는 애인 이름"
  },
  en: {
    friend: "Bestie name match",
    partner: "Stage partner name",
    classmate: "Classmate name match",
    drama: "Drama lead name",
    lover: "Lover name match"
  }
};

// Copy templates per relation (language-specific). Keep short, emoji-friendly.
export const COPY_TEMPLATES = {
  ko: {
    friend: ["찰떡 단짝 케미!", "찐친 바이브!"],
    partner: ["무대 장인 케미!", "폭발적 시너지!"],
    classmate: ["같은 반 단짝 느낌!", "매일 같이 등교할 조합!"],
    drama: ["드라마 주연급 케미!", "영화 같은 전개!"],
    lover: ["완벽한 커플 케미!", "심쿵 케미!", "운명적 케미!"]
  },
  en: {
    friend: ["Perfect bestie vibes!", "BFF energy!"],
    partner: ["Stage-killer chemistry!", "Explosive synergy!"],
    classmate: ["Desk-mate vibes!", "Everyday buddies!"],
    drama: ["Lead-role chemistry!", "Cinematic match!"],
    lover: ["Perfect couple chemistry!", "Heart-fluttering match!", "Fated chemistry!"]
  }
};

/**
 * Basic template interpolation: "Hello {{name}}" + {name:"World"}
 */
export function i18nFormat(template, vars={}){
  return String(template || '').replace(/\{\{(.*?)\}\}/g, (_, k) => vars[k.trim()] ?? '');
}

export function t(lang, key, vars){
  const dict = DICT[lang] || DICT.ko;
  const template = dict[key] || '';
  return i18nFormat(template, vars);
}

export function relationLabel(lang, relation){
  const map = RELATION_LABELS[lang] || RELATION_LABELS.ko;
  return map[relation] || map.lover;
}

export function relationCopy(lang, relation, index){
  const map = COPY_TEMPLATES[lang] || COPY_TEMPLATES.ko;
  const arr = map[relation] || map.lover;
  if(!arr.length) return '';
  return arr[Math.abs(index) % arr.length];
}

/**
 * Compose the KO/EN copy line similar to the spec examples.
 * Example (ko): 👉 '정국 & 서아', 완벽한 커플 케미! Sophia와도 환상의 조합이에요.
 * Example (en): 👉 'Jungkook & Seoa' — Perfect couple chemistry! Also great with Sophia.
 */
export function makeCopy({
  lang = 'ko',
  relation = 'lover',
  idolDisplay = '',      // e.g., idol.name_kr or name_en
  friendGiven = '',      // generated given name (without surname)
  myName = '',
  chemistry = 90,
  index = 0
}){
  const phrase = relationCopy(lang, relation, index);
  if(lang === 'en'){
    return `👉 '${idolDisplay} & ${friendGiven}' — ${phrase} Also a great match with ${myName}.`;
  }
  // default ko
  return `👉 '${idolDisplay} & ${friendGiven}', ${phrase} ${myName}와도 환상의 조합이에요.`;
}

/**
 * Make header string pair using i18n DICT
 */
export function makeHeaders({ lang='ko', myName, idolName, group }){
  return {
    header: t(lang, 'header_myName', { name: myName }),
    sub:    t(lang, 'header_idol',   { idol: idolName, group })
  };
}