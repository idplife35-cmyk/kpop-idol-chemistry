
/**
 * templates.js
 * - UI rendering helpers for results
 * - Relation type metadata (icon, label, sample phrases)
 */

export const RELATION_UI = {
  friend:   { icon: "👯", label: "어울리는 절친 이름",   copies: ["찰떡 단짝 케미!", "찐친 바이브!"] },
  partner:  { icon: "🎤", label: "어울리는 무대 파트너 이름", copies: ["무대 장인 케미!", "폭발적 시너지!"] },
  classmate:{ icon: "🏫", label: "어울리는 같은 반 친구 이름", copies: ["같은 반 단짝 느낌!", "매일 같이 등교할 조합!"] },
  drama:    { icon: "🎬", label: "드라마 속 주인공 이름", copies: ["드라마 주연급 케미!", "영화 같은 전개!"] },
  lover:    { icon: "❤️", label: "어울리는 애인 이름",   copies: ["완벽한 커플 케미!", "심쿵 케미!", "운명적 케미!"] }
};

/**
 * Render header block with my name + idol info
 */
export function renderHeader(myName, idol){
  return `
    💖 당신의 이름: ${escapeHtml(myName)}<br/>
    🎤 좋아하는 아이돌: ${escapeHtml(idol.name_kr)} (${escapeHtml(idol.group)})
  `;
}

/**
 * Render a result card for one generated name
 */
export function renderResultCard(title, icon, fullKr, fullEn, chemistry, copy){
  return `
    <div class="item">
      <div class="kv"><div class="key">${icon} ${title}</div><div class="name">${escapeHtml(fullKr)}</div></div>
      <div class="kv"><div class="key">영문 표기</div><div>${escapeHtml(fullEn)}</div></div>
      <div class="kv"><div class="key">케미 지수</div><div>${chemistry}%</div></div>
      <div class="kv"><div class="key">코멘트</div><div>${escapeHtml(copy)}</div></div>
    </div>
  `;
}

/**
 * Basic HTML escaping
 */
export function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, (ch)=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  }[ch]));
}