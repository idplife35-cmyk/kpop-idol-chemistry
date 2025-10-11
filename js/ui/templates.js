
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
      <div class="share-actions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 12px;">
        <!-- Primary share button -->
        <button type="button" class="btn jelly share-primary" onclick="shareToInstagram()">
          <span style="margin-right: 6px;">📸</span>${t('share.instagram')}
        </button>
        
        <!-- Facebook -->
        <button type="button" class="btn secondary" onclick="shareToFacebook()">
          <span style="margin-right: 6px;">📘</span>${t('share.facebook')}
        </button>
        
        <!-- Twitter/X -->
        <button type="button" class="btn secondary" onclick="shareToTwitter()">
          <span style="margin-right: 6px;">🐦</span>${t('share.twitter')}
        </button>
        
        <!-- Copy text -->
        <button type="button" class="btn secondary" onclick="copyShareText()">
          <span style="margin-right: 6px;">📋</span>${t('share.copy')}
        </button>
        
        <!-- Save to favorites -->
        <button type="button" class="btn secondary" id="favoriteBtn">
          <span style="margin-right: 6px;">❤️</span>Save to Favorites
        </button>
      </div>
      
      <!-- Share hint -->
      <p class="share-hint" style="margin-top: 12px; font-size: 0.9em; color: var(--muted);">
        💡 ${t('share.hint')}
      </p>
      
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
