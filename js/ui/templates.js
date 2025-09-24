
/**
 * templates.js
 * - UI rendering helpers for results
 * - Relation type metadata via i18n
 */

import { t, getLang } from '../i18n.js';

/**
 * Render header block with my name + idol info
 */
export function renderHeader(myName, idol){
  const lang = getLang();
  const idolName = lang === 'ko' ? idol.name_kr : idol.name_en;
  return `
    💖 ${t('header.myName')}: ${escapeHtml(myName)}<br/>
    🎤 ${t('header.idol')}: ${escapeHtml(idolName)} (${escapeHtml(idol.group)})
  `;
}

/**
 * Render a result card for one generated name
 */
export function renderResultCard(title, icon, fullKr, fullEn, chemistry, copy){
  return `
    <div class="item">
      <div class="kv"><div class="key">${icon} ${title}</div><div class="name">${escapeHtml(fullKr)}</div></div>
      <div class="kv"><div class="key">${t('result.englishLabel')}</div><div>${escapeHtml(fullEn)}</div></div>
      <div class="kv"><div class="key">${t('result.chemistry')}</div><div>${chemistry}%</div></div>
      <div class="kv"><div class="key">${t('result.comment')}</div><div>${escapeHtml(copy)}</div></div>
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
