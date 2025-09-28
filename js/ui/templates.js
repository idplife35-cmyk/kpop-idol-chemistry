
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

export function renderShareBlock(){
  return `
    <section class="share-block" data-share-root>
      <h3>${t('share.title')}</h3>
      <p>${t('share.subtitle')}</p>
      <div class="share-actions">
        <button type="button" class="btn share-btn" data-share="native">${t('share.native')}</button>
        <button type="button" class="btn secondary share-btn" data-share="twitter">${t('share.twitter')}</button>
        <button type="button" class="btn secondary share-btn" data-share="instagram">${t('share.instagram')}</button>
        <button type="button" class="btn secondary share-btn" data-share="copy">${t('share.copy')}</button>
      </div>
      <p class="share-status" data-share-status aria-live="polite"></p>
    </section>
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
