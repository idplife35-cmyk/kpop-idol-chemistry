
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
  console.log('renderShareBlock called');
  
  // Simple test version first
  const html = `
    <section class="share-block" data-share-root>
      <h3>Share your result</h3>
      <p>Let friends know about your new chemistry name!</p>
      
      <!-- TEST: Viral Content Generator -->
      <div class="viral-content-generator" style="margin: 16px 0; padding: 16px; background: #ffebf0; border: 2px solid #ff69b4; border-radius: 8px;">
        <h4 style="margin: 0 0 12px 0; font-size: 1.1rem; color: #d63384;">🎨 Create Viral Content</h4>
        <div class="viral-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin-bottom: 12px;">
          <button type="button" class="btn secondary viral-btn" data-type="story">
            📱 Story
          </button>
          <button type="button" class="btn secondary viral-btn" data-type="post">
            📝 Post
          </button>
          <button type="button" class="btn secondary viral-btn" data-type="meme">
            😂 Meme
          </button>
          <button type="button" class="btn secondary viral-btn" data-type="challenge">
            🎯 Challenge
          </button>
        </div>
        <div id="viral-content-preview" class="viral-preview" style="display: none; padding: 12px; background: var(--surface); border-radius: 6px; border: 1px solid var(--border);">
          <div id="viral-content-text"></div>
          <div class="viral-actions" style="margin-top: 8px; display: flex; gap: 8px;">
            <button type="button" class="btn secondary" onclick="copyViralContent()">📋 Copy</button>
            <button type="button" class="btn secondary" onclick="shareViralContent()">🚀 Share</button>
          </div>
        </div>
      </div>
      
      <!-- TEST: UGC Features -->
      <div class="ugc-features" style="margin: 16px 0; padding: 16px; background: #e8f5e8; border: 2px solid #28a745; border-radius: 8px;">
        <h4 style="margin: 0 0 12px 0; font-size: 1.1rem; color: #155724;">🌟 User Generated Content</h4>
        <div class="ugc-actions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px;">
          <button type="button" class="btn secondary ugc-btn" data-type="namecard">
            🎨 Name Card
          </button>
          <button type="button" class="btn secondary ugc-btn" data-type="hashtags">
            #️⃣ Hashtags
          </button>
          <button type="button" class="btn secondary ugc-btn" data-type="bio">
            📝 Bio
          </button>
          <button type="button" class="btn secondary ugc-btn" data-type="username">
            👤 Username
          </button>
        </div>
        <div id="ugc-preview" class="ugc-preview" style="display: none; margin-top: 12px; padding: 12px; background: var(--surface); border-radius: 6px; border: 1px solid var(--border);">
          <div id="ugc-content"></div>
          <div class="ugc-actions" style="margin-top: 8px; display: flex; gap: 8px;">
            <button type="button" class="btn secondary" onclick="copyUGCContent()">📋 Copy</button>
            <button type="button" class="btn secondary" onclick="shareUGCContent()">🚀 Share</button>
          </div>
        </div>
      </div>
      
      <!-- Basic share buttons -->
      <div class="share-actions" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 12px;">
        <button type="button" class="btn jelly share-primary" onclick="shareToInstagram()">
          <span style="margin-right: 6px;">📸</span>Instagram
        </button>
        <button type="button" class="btn secondary" onclick="shareToFacebook()">
          <span style="margin-right: 6px;">📘</span>Facebook
        </button>
        <button type="button" class="btn secondary" onclick="shareToTwitter()">
          <span style="margin-right: 6px;">🐦</span>Twitter
        </button>
        <button type="button" class="btn secondary" onclick="shareToTikTok()">
          <span style="margin-right: 6px;">🎵</span>TikTok
        </button>
        <button type="button" class="btn secondary" onclick="copyShareText()">
          <span style="margin-right: 6px;">📋</span>Copy Text
        </button>
        <button type="button" class="btn secondary" id="favoriteBtn">
          <span style="margin-right: 6px;">❤️</span>Save to Favorites
        </button>
      </div>
      
      <p class="share-hint" style="margin-top: 12px; font-size: 0.9em; color: var(--muted);">
        💡 Perfect for your social media bio or K-Pop fan content!
      </p>
      
      <p class="share-status" data-share-status aria-live="polite"></p>
    </section>
  `;
  console.log('Generated HTML length:', html.length);
  console.log('Generated HTML preview:', html.substring(0, 200) + '...');
  return html;
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
