
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
      <div class="share-actions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-top: 12px;">
        <!-- Primary share button -->
        <button type="button" class="btn jelly share-primary" onclick="shareToInstagram()">
          <span style="margin-right: 6px;">📸</span>${t('share.instagram')}
        </button>
        
        <!-- TikTok for Gen Z -->
        <button type="button" class="btn secondary" onclick="shareToTikTok()">
          <span style="margin-right: 6px;">🎵</span>${t('share.tiktok')}
        </button>
        
        <!-- Twitter/X -->
        <button type="button" class="btn secondary" onclick="shareToTwitter()">
          <span style="margin-right: 6px;">🐦</span>${t('share.twitter')}
        </button>
        
        <!-- Snapchat for younger users -->
        <button type="button" class="btn secondary" onclick="shareToSnapchat()">
          <span style="margin-right: 6px;">👻</span>${t('share.snapchat')}
        </button>
        
        <!-- Facebook -->
        <button type="button" class="btn secondary" onclick="shareToFacebook()">
          <span style="margin-right: 6px;">📘</span>${t('share.facebook')}
        </button>
        
        <!-- Discord for gaming community -->
        <button type="button" class="btn secondary" onclick="shareToDiscord()">
          <span style="margin-right: 6px;">💬</span>${t('share.discord')}
        </button>
        
        <!-- WhatsApp for international users -->
        <button type="button" class="btn secondary" onclick="shareToWhatsApp()">
          <span style="margin-right: 6px;">💚</span>${t('share.whatsapp')}
        </button>
        
        <!-- Telegram for privacy-focused users -->
        <button type="button" class="btn secondary" onclick="shareToTelegram()">
          <span style="margin-right: 6px;">✈️</span>${t('share.telegram')}
        </button>
        
        <!-- Pinterest for visual content -->
        <button type="button" class="btn secondary" onclick="shareToPinterest()">
          <span style="margin-right: 6px;">📌</span>${t('share.pinterest')}
        </button>
        
        <!-- Reddit for community sharing -->
        <button type="button" class="btn secondary" onclick="shareToReddit()">
          <span style="margin-right: 6px;">🤖</span>${t('share.reddit')}
        </button>
        
        <!-- Copy text -->
        <button type="button" class="btn secondary" onclick="copyShareText()">
          <span style="margin-right: 6px;">📋</span>${t('share.copy')}
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
