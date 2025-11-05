
import { q, on, setHTML, ariaLive } from './ui/dom.js';
import { renderHeader, renderResultCard, renderShareBlock } from './ui/templates.js';
import { relationUI, t, getLang } from './i18n.js';
import { getIdols, resolveIdol } from './data/idols.js';
import { generate } from './generator/engine.js';

// Global variable to store current result data
let currentResultData = null;

function relationValue(){ return q('input[name="relation"]:checked').value; }
function genderValue(){ return q('input[name="gender"]:checked').value; }

function populateIdolControls(idols){
  const datalist = q('#idolList');
  if(datalist){
    setHTML(datalist, idols.map(i => `<option value="${i.name_kr}">${i.group}</option>`).join(''));
  }

  const select = q('#idol');
  if(select && select.tagName === 'SELECT' && !select.hasAttribute('data-skip-global')){
    const current = select.value;
    const placeholder = `<option value="" disabled selected data-i18n="form.idol.selectPrompt">${t('form.idol.selectPrompt')}</option>`;
    const options = idols.map(i => `<option value="${i.name_kr}">${i.name_kr} (${i.name_en})</option>`).join('');
    setHTML(select, placeholder + options);
    if(current && idols.some(i => i.name_kr === current)){
      select.value = current;
    }
  }
}

async function init(){
  const idols = await getIdols();
  populateIdolControls(idols);
  populateVSIdolSelect(idols); // Populate VS mode idol select

  on(q('#form'), 'submit', async (e)=>{
    e.preventDefault();
    
    // Store current scroll position
    const currentScrollY = window.scrollY;
    
    const myName = q('#myName').value.trim();
    
    // 메인 폼에서 입력 시 Quick Start로도 동기화
    syncNameToQuickStart(myName);
    const idolInput = q('#idol').value.trim();
    const idol = await resolveIdol(idolInput);
    if(!idol){ alert(t('alert.selectIdol')); return; }

    const relation = relationValue();
    const genderPref = genderValue();

    // Track name generation event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'name_generation_started', {
        'event_category': 'engagement',
        'event_label': `${idol.group} - ${relation}`,
        'value': 1
      });
    }

    const { chemistry, sameName, styled } = await generate({ myName, idol, genderPref, relation });

    const header = renderHeader(myName, idol);
    const relUI = relationUI()[relation];

    const sameCopy = makeCopy(relation, chemistry, idol, myName, sameName.full_kr, sameName.full_en);
    const styledCopy = makeCopy(relation, chemistry, idol, myName, styled.full_kr, styled.full_en);

    const sameCard = renderResultCard(relUI.label, relUI.icon, sameName.full_kr, sameName.full_en, chemistry, sameCopy);
    const styledCard = renderResultCard(relUI.label, relUI.icon, styled.full_kr, styled.full_en, chemistry, styledCopy);
    const shareBlock = renderShareBlock();
    
    console.log('Share block content:', shareBlock);

    // Store current result data globally
    console.log('idol object:', idol);
    currentResultData = {
      myName: myName,
      idol: idol.name || idol.name_kr || idol.name_en || 'Unknown',
      group: idol.group,
      gender: genderPref,
      relation: relation,
      koreanName: sameName.full_kr,
      englishName: sameName.full_en,
      chemistry: chemistry
    };
    
    console.log('Current result data stored:', currentResultData);

    setHTML(q('#header'), header);
    setHTML(q('#results'), sameCard + styledCard + shareBlock);
    
    // Debug: Check if viral content generator is in DOM
    setTimeout(() => {
      const viralGenerator = q('.viral-content-generator');
      console.log('Viral content generator found:', viralGenerator);
      if (viralGenerator) {
        console.log('Viral content generator HTML:', viralGenerator.outerHTML);
      } else {
        console.log('Viral content generator NOT found!');
        // Check what's actually in the results div
        const resultsDiv = q('#results');
        console.log('Results div content:', resultsDiv ? resultsDiv.innerHTML.substring(0, 500) : 'Results div not found');
      }
    }, 100);
    
    // Re-initialize event listeners after rendering
    initFavoriteButton();
    initViralContentButtons();

  // Track successful name generation
  if (typeof gtag !== 'undefined') {
    gtag('event', 'name_generation_completed', {
      'event_category': 'conversion',
      'event_label': `${idol.group} - ${relation} - ${chemistry}%`,
      'value': chemistry
    });
  }

  // Save to history
  saveToHistory({
    timestamp: new Date().toISOString(),
    myName: myName,
    idol: idol.name,
    group: idol.group,
    gender: genderPref,
    relation: relation,
    koreanName: sameName.full_kr,
    englishName: sameName.full_en,
    chemistry: chemistry
  });

    // Check if mobile and scroll to results
    const isMobile = window.innerWidth <= 760;
    if (isMobile) {
      // Force scroll to results after a short delay
      setTimeout(() => {
        scrollToResults();
      }, 50);
    } else {
      // For desktop, maintain current scroll position
      window.scrollTo(0, currentScrollY);
    }

    setupShare({ myName, idol, chemistry, styled, same: sameName });
  });
}

function friendGiven(fullKr){ return fullKr.slice(1); }

function makeCopy(relation, chem, idol, myName, friendFullKr, friendFullEn){
  const rel = relationUI()[relation];
  const phrase = rel.copies[chem % rel.copies.length];
  const lang = getLang();
  if(lang === 'ko'){
    return `👉 '${idol.name_kr} & ${friendGiven(friendFullKr)}', ${phrase} ${myName}와도 환상의 조합이에요.`;
  }
  return `👉 '${idol.name_en} & ${friendFullEn}', ${phrase} Also a perfect match with ${myName}.`;
}

function shareText({ myName, idol, chemistry, styled }){
  const lang = getLang();
  const idolName = lang === 'ko' ? idol.name_kr : idol.name_en;
  const highlight = lang === 'ko' ? styled.full_kr : styled.full_en;
  if(lang === 'ko'){
    return `케미 ${chemistry}%! ${idolName}와 어울리는 내 이름은 '${highlight}'. ${t('share.cta')}`;
  }
  return `Chemistry ${chemistry}% with ${idolName}! My new name is '${highlight}'. ${t('share.cta')}`;
}

async function copyToClipboard(payload){
  if(navigator.clipboard && navigator.clipboard.writeText){
    await navigator.clipboard.writeText(payload);
    return true;
  }
  const textarea = document.createElement('textarea');
  textarea.value = payload;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    document.body.removeChild(textarea);
    return false;
  }
}

function setupShare({ myName, idol, chemistry, styled, same }){
  const root = q('[data-share-root]');
  if(!root) return;
  const statusEl = q('[data-share-status]', root);
  const url = window.location.href;
  const text = shareText({ myName, idol, chemistry, styled, same });
  const status = (msg)=>{
    if(statusEl){ statusEl.textContent = msg; }
    if(msg){ ariaLive(msg); }
  };
  status('');

  const nativeBtn = root.querySelector('[data-share="native"]');
  if(nativeBtn){
    if(!navigator.share){
      nativeBtn.classList.add('hidden');
    } else {
      on(nativeBtn, 'click', async ()=>{
        try {
          await navigator.share({ text, url });
          status('');
        } catch(err){
          if(err && err.name === 'AbortError'){ return; }
          status(t('share.error'));
        }
      });
    }
  }

  const twitterBtn = root.querySelector('[data-share="twitter"]');
  if(twitterBtn){
    on(twitterBtn, 'click', (e)=>{
      e.preventDefault();
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      
      // Track share event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          'event_category': 'social',
          'event_label': 'twitter',
          'method': 'twitter'
        });
      }
      
      window.open(shareUrl, '_blank', 'noopener');
    });
  }

  const copyBtn = root.querySelector('[data-share="copy"]');
  if(copyBtn){
    on(copyBtn, 'click', async ()=>{
      const payload = `${text}\n${url}`;
      try {
        const ok = await copyToClipboard(payload);
        
        // Track copy event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'share', {
            'event_category': 'social',
            'event_label': 'copy',
            'method': 'copy'
          });
        }
        
        status(ok ? t('share.copied') : t('share.error'));
      } catch {
        status(t('share.error'));
      }
    });
  }

  const instagramBtn = root.querySelector('[data-share="instagram"]');
  if(instagramBtn){
    on(instagramBtn, 'click', async ()=>{
      const payload = `${text}\n${url}`;
      try {
        const ok = await copyToClipboard(payload);
        
        // Track Instagram share event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'share', {
            'event_category': 'social',
            'event_label': 'instagram',
            'method': 'instagram'
          });
        }
        
        status(ok ? t('share.instagramHint') : t('share.error'));
      } catch {
        status(t('share.error'));
      }
      window.open('https://www.instagram.com/', '_blank', 'noopener');
    });
  }
}

// Scroll to results function (mobile only)
function scrollToResults() {
  // Find the first result card (the first .item within .result)
  const firstResultCard = document.querySelector('.result .item');
  
  if (firstResultCard) {
    // Get the exact position
    const rect = firstResultCard.getBoundingClientRect();
    const targetPosition = window.pageYOffset + rect.top - 20;
    
    // Force scroll immediately
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Also try with instant scroll as backup
    setTimeout(() => {
      window.scrollTo(0, targetPosition);
    }, 100);
  } else {
    // Fallback to results heading (language independent)
    const resultsHeading = document.querySelector('h3[data-i18n="results.title"]');
    if (resultsHeading) {
      const rect = resultsHeading.getBoundingClientRect();
      const targetPosition = window.pageYOffset + rect.top - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        window.scrollTo(0, targetPosition);
      }, 100);
    } else {
      // Final fallback: find any h3 that contains "Results" or "결과"
      const allHeadings = document.querySelectorAll('h3');
      const resultsHeadingFallback = Array.from(allHeadings).find(h => 
        h.textContent.includes('Results') || 
        h.textContent.includes('결과') ||
        h.textContent.includes('Chemistry')
      );
      
      if (resultsHeadingFallback) {
        const rect = resultsHeadingFallback.getBoundingClientRect();
        const targetPosition = window.pageYOffset + rect.top - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          window.scrollTo(0, targetPosition);
        }, 100);
      }
    }
  }
}

// History and Favorites functionality
function saveToHistory(result) {
  try {
    const history = JSON.parse(localStorage.getItem('kpopNameHistory') || '[]');
    history.unshift(result); // Add to beginning
    // Keep only last 50 entries
    if (history.length > 50) {
      history.splice(50);
    }
    localStorage.setItem('kpopNameHistory', JSON.stringify(history));
    updateHistoryUI();
  } catch (e) {
    console.warn('Failed to save to history:', e);
  }
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('kpopNameHistory') || '[]');
  } catch (e) {
    return [];
  }
}

function saveToFavorites(result) {
  try {
    const favorites = JSON.parse(localStorage.getItem('kpopNameFavorites') || '[]');
    const exists = favorites.some(fav => 
      fav.myName === result.myName && 
      fav.idol === result.idol && 
      fav.relation === result.relation
    );
    if (!exists) {
      favorites.unshift(result);
      localStorage.setItem('kpopNameFavorites', JSON.stringify(favorites));
      updateFavoritesUI();
    }
  } catch (e) {
    console.warn('Failed to save to favorites:', e);
  }
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('kpopNameFavorites') || '[]');
  } catch (e) {
    return [];
  }
}

function removeFromFavorites(result) {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => 
      !(fav.myName === result.myName && 
        fav.idol === result.idol && 
        fav.relation === result.relation)
    );
    localStorage.setItem('kpopNameFavorites', JSON.stringify(filtered));
    updateFavoritesUI();
  } catch (e) {
    console.warn('Failed to remove from favorites:', e);
  }
}

function updateHistoryUI() {
  const history = getHistory();
  const historyList = q('#history-list');
  const historyEmptyState = q('#history-empty-state');
  
  if (!historyList) return;

  if (history.length === 0) {
    historyList.style.display = 'none';
    if (historyEmptyState) historyEmptyState.style.display = 'block';
    return;
  }

  historyList.style.display = 'grid';
  if (historyEmptyState) historyEmptyState.style.display = 'none';

  const historyHTML = history.slice(0, 10).map((item, index) => `
    <div style="padding: 16px; background: var(--chip); border-radius: 8px; border: 1px solid var(--border);">
      <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start;">
        <div>
          <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 6px;">
            ${item.koreanName} <span style="color: var(--muted); font-size: 0.9rem;">(${item.englishName})</span>
          </div>
          <div style="font-size: 0.9rem; color: var(--muted); margin-bottom: 4px;">
            👤 ${item.myName} + 🎤 ${item.idol} (${item.group})
          </div>
          <div style="font-size: 0.85rem; color: var(--muted);">
            💖 ${item.relation} • Chemistry: ${item.chemistry}% • ${formatTimeAgo(item.timestamp)}
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button type="button" class="btn secondary" onclick="regenerateFromHistory('${escapeHtml(item.myName)}', '${escapeHtml(item.idol)}', '${item.gender}', '${item.relation}')" style="padding: 6px 12px; font-size: 0.85rem; white-space: nowrap;">
            🔄 Retry
          </button>
          <button type="button" class="btn secondary" onclick="addHistoryToFavorites(${index})" style="padding: 6px 12px; font-size: 0.85rem; white-space: nowrap;">
            ❤️ Save
          </button>
        </div>
      </div>
    </div>
  `).join('');

  historyList.innerHTML = historyHTML;
}

function updateFavoritesUI() {
  const favorites = getFavorites();
  const favoritesList = q('#favorites-list');
  const favoritesEmptyState = q('#favorites-empty-state');
  
  if (!favoritesList) return;

  if (favorites.length === 0) {
    favoritesList.style.display = 'none';
    if (favoritesEmptyState) favoritesEmptyState.style.display = 'block';
    return;
  }

  favoritesList.style.display = 'grid';
  if (favoritesEmptyState) favoritesEmptyState.style.display = 'none';

  const favoritesHTML = favorites.map((item, index) => `
    <div style="padding: 16px; background: linear-gradient(135deg, rgba(255,46,139,.05), rgba(180,144,255,.05)); border-radius: 8px; border: 2px solid var(--accent); position: relative;">
      <div style="position: absolute; top: 8px; right: 8px; font-size: 1.5rem;">❤️</div>
      <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start;">
        <div>
          <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 6px;">
            ${item.koreanName} <span style="color: var(--muted); font-size: 0.9rem;">(${item.englishName})</span>
          </div>
          <div style="font-size: 0.9rem; color: var(--muted); margin-bottom: 4px;">
            👤 ${item.myName} + 🎤 ${item.idol} (${item.group})
          </div>
          <div style="font-size: 0.85rem; color: var(--muted);">
            💖 ${item.relation} • Chemistry: ${item.chemistry}% • Saved ${formatTimeAgo(item.timestamp)}
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button type="button" class="btn secondary" onclick="regenerateFromHistory('${escapeHtml(item.myName)}', '${escapeHtml(item.idol)}', '${item.gender}', '${item.relation}')" style="padding: 6px 12px; font-size: 0.85rem; white-space: nowrap;">
            🔄 Retry
          </button>
          <button type="button" class="btn secondary" onclick="removeFavoriteByIndex(${index})" style="padding: 6px 12px; font-size: 0.85rem; white-space: nowrap;">
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');

  favoritesList.innerHTML = favoritesHTML;
}

function regenerateFromHistory(myName, idol, gender, relation) {
  // Fill the form with historical data
  q('#myName').value = myName;
  q('#idol').value = idol;
  q('#gender').value = gender;
  q('#relation').value = relation;
  
  // Trigger generation
  generateName();
}

function clearHistory() {
  if (confirm('Are you sure you want to clear all history?')) {
    localStorage.removeItem('kpopNameHistory');
    updateHistoryUI();
  }
}

function clearFavorites() {
  if (confirm('Are you sure you want to clear all favorites? 즐겨찾기를 모두 삭제하시겠습니까?')) {
    localStorage.removeItem('kpopNameFavorites');
    updateFavoritesUI();
  }
}

// 🚀 Phase 1-3: History/Favorites UI Helper Functions
function toggleHistoryView() {
  const historySection = q('#history-section');
  const favoritesSection = q('#favorites-section');
  const historyEmptyState = q('#history-empty-state');
  const favoritesEmptyState = q('#favorites-empty-state');
  
  if (historySection.style.display === 'none' || historySection.style.display === '') {
    // Show history
    historySection.style.display = 'block';
    favoritesSection.style.display = 'none';
    favoritesEmptyState.style.display = 'none';
    updateHistoryUI();
  } else {
    // Hide history
    historySection.style.display = 'none';
    historyEmptyState.style.display = 'none';
  }
}

function toggleFavoritesView() {
  const historySection = q('#history-section');
  const favoritesSection = q('#favorites-section');
  const historyEmptyState = q('#history-empty-state');
  const favoritesEmptyState = q('#favorites-empty-state');
  
  if (favoritesSection.style.display === 'none' || favoritesSection.style.display === '') {
    // Show favorites
    favoritesSection.style.display = 'block';
    historySection.style.display = 'none';
    historyEmptyState.style.display = 'none';
    updateFavoritesUI();
  } else {
    // Hide favorites
    favoritesSection.style.display = 'none';
    favoritesEmptyState.style.display = 'none';
  }
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function addHistoryToFavorites(index) {
  const history = getHistory();
  if (history[index]) {
    saveToFavorites(history[index]);
    alert('Added to favorites! 즐겨찾기에 추가되었습니다!');
  }
}

function removeFavoriteByIndex(index) {
  try {
    const favorites = getFavorites();
    favorites.splice(index, 1);
    localStorage.setItem('kpopNameFavorites', JSON.stringify(favorites));
    updateFavoritesUI();
  } catch (e) {
    console.warn('Failed to remove favorite:', e);
  }
}

// Initialize history and favorites UI on page load
function initHistoryFavorites() {
  updateHistoryUI();
  updateFavoritesUI();
}

// Viral Content Generation
function generateViralContent(type) {
  const currentResult = getCurrentResult();
  if (!currentResult) {
    showStatus('❌ No result found. Please generate a name first.');
    console.log('No current result found for viral content generation');
    return;
  }
  
  console.log('Generating viral content:', type, currentResult);
  
  const { myName, idol, koreanName, englishName, chemistry, relation } = currentResult;
  const safeIdol = idol || 'Unknown';
  const idolTag = safeIdol.replace(/\s+/g, '');
  let content = '';
  
  switch(type) {
    case 'story':
      content = `✨ Just discovered my K-Pop chemistry name! ✨
      
💜 My name: ${myName}
🎤 With: ${safeIdol}
🌟 My Korean name: ${koreanName} (${englishName})
💕 Chemistry: ${chemistry}%
🎭 Relationship: ${relation}

Who else wants to find their K-Pop name? 🎵
#KPopNameGenerator #${idolTag} #KoreanName #KPopChemistry`;
      break;
      
    case 'post':
      content = `🎵 K-Pop Name Generator Results! 🎵

I just tried the K-Pop Idol Chemistry Name Generator and I'm obsessed! 

My Results:
👤 Name: ${myName}
💫 Idol: ${safeIdol}
🌟 Korean Name: ${koreanName} (${englishName})
💖 Chemistry Score: ${chemistry}%
💕 Relationship: ${relation}

This is so accurate! The generator created the perfect Korean name that matches my vibe with ${safeIdol}. 

Try it yourself and share your results! 
Link in bio 🔗

#KPopNameGenerator #${idolTag} #KoreanName #KPopChemistry #KPopFans`;
      break;
      
    case 'meme':
      content = `When you find out your K-Pop chemistry name is ${koreanName} and you have ${chemistry}% chemistry with ${safeIdol}:

😭 "This is literally me"
💜 "I'm literally ${koreanName} now"
🎵 "I can't believe this is so accurate"
🤯 "How did they know??"

Try the K-Pop Name Generator and see if you relate! 
#KPopMeme #KPopNameGenerator #${idolTag} #Relatable #KPopFans`;
      break;
      
    case 'challenge':
      content = `🎯 K-Pop Name Challenge! 🎯

I challenge you to:
1. Go to the K-Pop Name Generator
2. Find your chemistry name with your bias
3. Share your results with this template
4. Tag 3 friends to do the same!

My Results:
👤 ${myName} + ${safeIdol} = ${koreanName} (${englishName})
💖 Chemistry: ${chemistry}%
🎭 Relationship: ${relation}

I challenge: @friend1 @friend2 @friend3
Your turn! 🎵

#KPopNameChallenge #KPopNameGenerator #${idolTag} #KPopChallenge #KPopFans`;
      break;
  }
  
  showViralContent(content);
  
  // Track viral content generation
  if (typeof gtag !== 'undefined') {
    gtag('event', 'viral_content_generated', {
      'event_category': 'social',
      'event_label': type,
      'value': 1
    });
  }
}

function showViralContent(content) {
  const preview = q('#viral-content-preview');
  const text = q('#viral-content-text');
  if (preview && text) {
    text.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${content}</pre>`;
    preview.style.display = 'block';
    // Remove auto-scroll to prevent hiding top area
    // preview.scrollIntoView({ behavior: 'smooth' });
  }
}

function copyViralContent() {
  const text = q('#viral-content-text');
  if (text) {
    const content = text.textContent;
    navigator.clipboard.writeText(content).then(() => {
      showStatus('✅ Viral content copied to clipboard!');
    });
  }
}

function shareViralContent() {
  const text = q('#viral-content-text');
  if (text) {
    const content = text.textContent;
    const url = window.location.href;
    const shareText = `${content}\n\nTry it yourself: ${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My K-Pop Chemistry Name',
        text: shareText,
        url: url
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        showStatus('✅ Content copied! Share it on your favorite platform!');
      });
    }
  }
}

// UGC Features
function createNameCard() {
  const currentResult = getCurrentResult();
  if (!currentResult) {
    showStatus('❌ No result found. Please generate a name first.');
    console.log('No current result found for name card creation');
    return;
  }
  
  console.log('Creating name card:', currentResult);
  
  const { myName, idol, koreanName, englishName, chemistry, relation } = currentResult;
  
  const cardContent = `
┌─────────────────────────┐
│     💜 K-Pop Name Card 💜    │
├─────────────────────────┤
│  👤 My Name: ${myName.padEnd(15)} │
│  🎤 With: ${idol.padEnd(16)} │
│  🌟 Korean: ${koreanName.padEnd(12)} │
│  📝 English: ${englishName.padEnd(11)} │
│  💖 Chemistry: ${chemistry}%${' '.repeat(8)} │
│  🎭 Type: ${relation.padEnd(12)} │
└─────────────────────────┘

Generated by K-Pop Idol Chemistry Name Generator
  `;
  
  showUGCContent(cardContent);
}

function generateHashtags() {
  const currentResult = getCurrentResult();
  if (!currentResult) {
    showStatus('❌ No result found. Please generate a name first.');
    return;
  }
  
  const { idol, koreanName, chemistry } = currentResult;
  const safeIdol = idol || 'Unknown';
  const idolTag = safeIdol.replace(/\s+/g, '');
  const nameTag = koreanName.replace(/\s+/g, '');
  
  const hashtags = `#KPopNameGenerator #${idolTag} #${nameTag} #KoreanName #KPopChemistry #KPopFans #KPop #KoreanCulture #NameGenerator #Chemistry #${chemistry}Percent #KPopBias #KPopIdol #KoreanLanguage #KPopCommunity #KPopTrend #KPopViral #KPopChallenge #KPopFun #KPopLove`;
  
  showUGCContent(hashtags);
}

function createBio() {
  const currentResult = getCurrentResult();
  if (!currentResult) {
    showStatus('❌ No result found. Please generate a name first.');
    return;
  }
  
  const { myName, idol, koreanName, englishName, chemistry } = currentResult;
  const safeIdol = idol || 'Unknown';
  
  const bioOptions = [
    `💜 ${koreanName} (${englishName}) | ${chemistry}% chemistry with ${safeIdol} ✨
K-Pop enthusiast | Korean name twin | ${safeIdol} stan
DM for K-Pop name generator link! 🎵`,
    
    `🌟 ${koreanName} | ${myName} in Korean ✨
${chemistry}% chemistry with ${safeIdol} 💕
K-Pop name generator made this possible! 🎤`,
    
    `🎵 K-Pop Name: ${koreanName} (${englishName})
💖 ${chemistry}% chemistry with ${safeIdol}
✨ Living my best K-Pop life
🔗 Link in bio for name generator!`,
    
    `💫 ${koreanName} | ${safeIdol} chemistry: ${chemistry}%
🎤 K-Pop enthusiast | Korean culture lover
✨ Found my Korean name through K-Pop Name Generator
🎵 DM for the link!`
  ];
  
  const randomBio = bioOptions[Math.floor(Math.random() * bioOptions.length)];
  showUGCContent(randomBio);
}

function generateUsername() {
  const currentResult = getCurrentResult();
  if (!currentResult) {
    showStatus('❌ No result found. Please generate a name first.');
    return;
  }
  
  const { myName, idol, koreanName, englishName, chemistry } = currentResult;
  const safeIdol = idol || 'Unknown';
  const idolShort = safeIdol.replace(/\s+/g, '').toLowerCase();
  const nameShort = koreanName.replace(/\s+/g, '').toLowerCase();
  const nameEng = englishName.replace(/\s+/g, '').toLowerCase();
  
  const usernameOptions = [
    `${nameShort}_${idolShort}`,
    `${nameEng}_${chemistry}percent`,
    `${nameShort}_kpop`,
    `${idolShort}_${nameShort}`,
    `kpop_${nameShort}`,
    `${nameShort}_chemistry`,
    `${nameEng}_${idolShort}`,
    `${nameShort}_stan`,
    `korean_${nameShort}`,
    `${nameShort}_${chemistry}`
  ];
  
  const usernames = usernameOptions.join('\n');
  showUGCContent(usernames);
}

function showUGCContent(content) {
  const preview = q('#ugc-preview');
  const text = q('#ugc-content');
  if (preview && text) {
    text.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${content}</pre>`;
    preview.style.display = 'block';
    // Remove auto-scroll to prevent hiding top area
    // preview.scrollIntoView({ behavior: 'smooth' });
  }
}

function copyUGCContent() {
  const text = q('#ugc-content');
  if (text) {
    const content = text.textContent;
    navigator.clipboard.writeText(content).then(() => {
      showStatus('✅ UGC content copied to clipboard!');
    });
  }
}

function shareUGCContent() {
  const text = q('#ugc-content');
  if (text) {
    const content = text.textContent;
    const url = window.location.href;
    const shareText = `${content}\n\nGenerated by K-Pop Name Generator: ${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My K-Pop UGC Content',
        text: shareText,
        url: url
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        showStatus('✅ UGC content copied! Share it on your favorite platform!');
      });
    }
  }
}

function getCurrentResult() {
  console.log('getCurrentResult called, currentResultData:', currentResultData);
  return currentResultData;
}

function showStatus(message) {
  const status = q('[data-share-status]');
  if (status) {
    status.textContent = message;
    setTimeout(() => {
      status.textContent = '';
    }, 3000);
  }
}

function shareToInstagram() {
  const url = window.location.href;
  const text = `✨ Just discovered my K-Pop chemistry name! ✨\n\nTry the K-Pop Idol Chemistry Name Generator and find your perfect Korean name! 🎵\n\n${url}`;
  
  // Track Instagram share
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      'method': 'instagram',
      'content_type': 'name_generator',
      'item_id': 'kpop_name_generator'
    });
  }
  
  if (navigator.share) {
    navigator.share({
      title: 'My K-Pop Chemistry Name',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on Instagram!');
    });
  }
}

function shareToFacebook() {
  const url = window.location.href;
  const text = `🎵 K-Pop Name Generator Results! 🎵\n\nI just tried the K-Pop Idol Chemistry Name Generator and I'm obsessed!\n\nTry it yourself: ${url}`;
  
  // Track Facebook share
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      'method': 'facebook',
      'content_type': 'name_generator',
      'item_id': 'kpop_name_generator'
    });
  }
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on Facebook!');
    });
  }
}

function shareToTwitter() {
  const url = window.location.href;
  const text = `🎵 Just found my K-Pop chemistry name! ✨\n\nTry the K-Pop Name Generator: ${url}\n\n#KPopNameGenerator #KPopFans #KoreanName`;
  
  // Track Twitter share
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      'method': 'twitter',
      'content_type': 'name_generator',
      'item_id': 'kpop_name_generator'
    });
  }
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on Twitter!');
    });
  }
}

function copyShareText() {
  const currentResult = getCurrentResult();
  if (!currentResult) {
    showStatus('❌ No result found. Please generate a name first.');
    return;
  }
  
  const { myName, idol, koreanName, englishName, chemistry } = currentResult;
  const text = `✨ My K-Pop Chemistry Name ✨\n\n👤 Name: ${myName}\n🎤 With: ${idol}\n🌟 Korean Name: ${koreanName} (${englishName})\n💖 Chemistry: ${chemistry}%\n\nTry it yourself: ${window.location.href}`;
  
  navigator.clipboard.writeText(text).then(() => {
    showStatus('✅ Share text copied to clipboard!');
  });
}

function shareToSnapchat() {
  const url = window.location.href;
  const text = `🎵 K-Pop Name Generator! ✨\n\nFind your Korean name: ${url}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on Snapchat!');
    });
  }
}

function shareToDiscord() {
  const url = window.location.href;
  const text = `🎵 **K-Pop Name Generator** 🎵\n\nJust found my Korean chemistry name! ✨\n\nTry it yourself: ${url}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on Discord!');
    });
  }
}

function shareToWhatsApp() {
  const url = window.location.href;
  const text = `🎵 K-Pop Name Generator! ✨\n\nFind your Korean chemistry name: ${url}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on WhatsApp!');
    });
  }
}

function shareToTelegram() {
  const url = window.location.href;
  const text = `🎵 K-Pop Name Generator! ✨\n\nFind your Korean chemistry name: ${url}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on Telegram!');
    });
  }
}

function shareToPinterest() {
  const url = window.location.href;
  const text = `🎵 K-Pop Name Generator - Find Your Korean Chemistry Name! ✨\n\n${url}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on Pinterest!');
    });
  }
}

function shareToReddit() {
  const url = window.location.href;
  const text = `🎵 K-Pop Name Generator Results! 🎵\n\nI just tried the K-Pop Idol Chemistry Name Generator and it's amazing!\n\nTry it yourself: ${url}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on Reddit!');
    });
  }
}

function shareToTikTok() {
  const url = window.location.href;
  const text = `🎵 K-Pop Name Generator Challenge! 🎵\n\nI just found my K-Pop chemistry name and it's PERFECT! ✨\n\nTry it yourself and share your results! \n\n${url}\n\n#KPopNameGenerator #KPopChallenge #KoreanName #KPopFans #KPopViral`;
  
  // Track TikTok share
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      'method': 'tiktok',
      'content_type': 'name_generator',
      'item_id': 'kpop_name_generator'
    });
  }
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Name Generator Challenge',
      text: text,
      url: url
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Content copied! Share it on TikTok!');
    });
  }
}

// Add event listener for favorite button
function initFavoriteButton() {
  const favoriteBtn = q('#favoriteBtn');
  if (favoriteBtn && !favoriteBtn.hasAttribute('data-listener-added')) {
    favoriteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentResult = getCurrentResult();
      if (currentResult) {
        saveToFavorites(currentResult);
        showStatus('✅ Added to favorites!');
      } else {
        showStatus('❌ No result to save. Please generate a name first.');
      }
    });
    favoriteBtn.setAttribute('data-listener-added', 'true');
  }
}

function initViralContentButtons() {
  // Viral content buttons
  const viralButtons = document.querySelectorAll('.viral-content-generator .viral-btn');
  viralButtons.forEach(btn => {
    if (!btn.hasAttribute('data-listener-added')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const type = btn.getAttribute('data-type');
        if (type) {
          generateViralContent(type);
        }
      });
      btn.setAttribute('data-listener-added', 'true');
    }
  });
  
  // UGC buttons
  const ugcButtons = document.querySelectorAll('.ugc-features .ugc-btn');
  ugcButtons.forEach(btn => {
    if (!btn.hasAttribute('data-listener-added')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const type = btn.getAttribute('data-type');
        if (type) {
          switch(type) {
            case 'namecard':
              createNameCard();
              break;
            case 'hashtags':
              generateHashtags();
              break;
            case 'bio':
              createBio();
              break;
            case 'username':
              generateUsername();
              break;
          }
        }
      });
      btn.setAttribute('data-listener-added', 'true');
    }
  });
}

// 🚀 Phase 1: Quick Generate Functions (원클릭 생성)

// Quick Start와 메인 폼 이름 동기화
function syncNameToMainForm(name) {
  const mainInput = q('#myName');
  if (mainInput) {
    mainInput.value = name;
  }
}

function syncNameToQuickStart(name) {
  const quickInput = q('#quick-name-input');
  if (quickInput) {
    quickInput.value = name;
  }
}

async function quickGenerate(idolName, relation, buttonElement) {
  // Quick Start 입력란에서 이름 가져오기
  const quickNameInput = q('#quick-name-input');
  let myName = quickNameInput ? quickNameInput.value.trim() : '';
  
  // Quick Start에 없으면 메인 폼에서 가져오기
  if (!myName) {
    myName = q('#myName').value.trim();
  }
  
  if (!myName) {
    alert('Please enter your name first! 이름을 먼저 입력해주세요!');
    if (quickNameInput) {
      quickNameInput.focus();
    } else {
      q('#myName').focus();
    }
    return;
  }
  
  // 버튼 로딩 상태로 변경
  const btn = buttonElement || event.target;
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '⏳ Generating...';
  btn.style.opacity = '0.7';
  
  // 양쪽 입력란 모두 동기화
  syncNameToMainForm(myName);
  syncNameToQuickStart(myName);
  
  // Set form values
  q('#idol').value = idolName;
  const relationRadio = q(`input[name="relation"][value="${relation}"]`);
  if (relationRadio) relationRadio.checked = true;
  
  // Track quick generate event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'quick_generate', {
      'event_category': 'engagement',
      'event_label': `${idolName} - ${relation}`,
      'value': 1
    });
  }
  
  // Trigger form submission
  q('#form').dispatchEvent(new Event('submit'));
  
  // 결과 영역으로 스크롤 (약간의 딜레이 후)
  setTimeout(() => {
    const resultCard = q('#result-card');
    if (resultCard && resultCard.style.display !== 'none') {
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 결과 카드 강조 애니메이션
      resultCard.style.animation = 'fadeInScale 0.5s ease-out';
    }
    
    // 버튼 원래 상태로 복구
    btn.disabled = false;
    btn.innerHTML = originalText;
    btn.style.opacity = '1';
  }, 800);
}

async function quickGenerateToday(buttonElement) {
  // Quick Start 입력란에서 이름 가져오기
  const quickNameInput = q('#quick-name-input');
  let myName = quickNameInput ? quickNameInput.value.trim() : '';
  
  // Quick Start에 없으면 메인 폼에서 가져오기
  if (!myName) {
    myName = q('#myName').value.trim();
  }
  
  if (!myName) {
    alert('Please enter your name first! 이름을 먼저 입력해주세요!');
    if (quickNameInput) {
      quickNameInput.focus();
    } else {
      q('#myName').focus();
    }
    return;
  }
  
  // 버튼 로딩 상태로 변경
  const btn = buttonElement || event.target;
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '⏳ Generating...';
  btn.style.opacity = '0.7';
  
  // 양쪽 입력란 모두 동기화
  syncNameToMainForm(myName);
  syncNameToQuickStart(myName);
  
  // Get today's lucky combo (changes daily)
  const todayCombo = getTodayLuckyCombo();
  
  // Set form values
  q('#idol').value = todayCombo.idol;
  const relationRadio = q(`input[name="relation"][value="${todayCombo.relation}"]`);
  if (relationRadio) relationRadio.checked = true;
  
  // Track today's combo
  if (typeof gtag !== 'undefined') {
    gtag('event', 'quick_generate_today', {
      'event_category': 'engagement',
      'event_label': `${todayCombo.idol} - ${todayCombo.relation}`,
      'value': 1
    });
  }
  
  // Trigger form submission
  q('#form').dispatchEvent(new Event('submit'));
  
  // 결과 영역으로 스크롤 (약간의 딜레이 후)
  setTimeout(() => {
    const resultCard = q('#result-card');
    if (resultCard && resultCard.style.display !== 'none') {
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 결과 카드 강조 애니메이션
      resultCard.style.animation = 'fadeInScale 0.5s ease-out';
    }
    
    // 버튼 원래 상태로 복구
    btn.disabled = false;
    btn.innerHTML = originalText;
    btn.style.opacity = '1';
  }, 800);
}

async function quickGenerateRandom(buttonElement) {
  // Quick Start 입력란에서 이름 가져오기
  const quickNameInput = q('#quick-name-input');
  let myName = quickNameInput ? quickNameInput.value.trim() : '';
  
  // Quick Start에 없으면 메인 폼에서 가져오기
  if (!myName) {
    myName = q('#myName').value.trim();
  }
  
  if (!myName) {
    alert('Please enter your name first! 이름을 먼저 입력해주세요!');
    if (quickNameInput) {
      quickNameInput.focus();
    } else {
      q('#myName').focus();
    }
    return;
  }
  
  // 버튼 로딩 상태로 변경
  const btn = buttonElement || event.target;
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '🎲 Rolling...';
  btn.style.opacity = '0.7';
  
  // 양쪽 입력란 모두 동기화
  syncNameToMainForm(myName);
  syncNameToQuickStart(myName);
  
  // Get random combo
  const idols = await getIdols();
  const randomIdol = idols[Math.floor(Math.random() * idols.length)];
  const relations = ['friend', 'partner', 'classmate', 'drama', 'lover'];
  const randomRelation = relations[Math.floor(Math.random() * relations.length)];
  
  // Set form values
  q('#idol').value = randomIdol.name_kr;
  const relationRadio = q(`input[name="relation"][value="${randomRelation}"]`);
  if (relationRadio) relationRadio.checked = true;
  
  // Track random generate
  if (typeof gtag !== 'undefined') {
    gtag('event', 'quick_generate_random', {
      'event_category': 'engagement',
      'event_label': 'random',
      'value': 1
    });
  }
  
  // Trigger form submission
  q('#form').dispatchEvent(new Event('submit'));
  
  // 결과 영역으로 스크롤 (약간의 딜레이 후)
  setTimeout(() => {
    const resultCard = q('#result-card');
    if (resultCard && resultCard.style.display !== 'none') {
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 결과 카드 강조 애니메이션
      resultCard.style.animation = 'fadeInScale 0.5s ease-out';
    }
    
    // 버튼 원래 상태로 복구
    btn.disabled = false;
    btn.innerHTML = originalText;
    btn.style.opacity = '1';
  }, 800);
}

function getTodayLuckyCombo() {
  // Changes daily based on date
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  
  const luckyIdols = [
    { idol: '지민', relation: 'lover', text: '지민 × Lover' },
    { idol: '로제', relation: 'drama', text: '로제 × Drama Lead' },
    { idol: '뷔', relation: 'friend', text: '뷔 × Best Friend' },
    { idol: '제니', relation: 'partner', text: '제니 × Stage Partner' },
    { idol: '정국', relation: 'classmate', text: '정국 × Classmate' },
    { idol: '지수', relation: 'lover', text: '지수 × Lover' },
    { idol: '민지', relation: 'friend', text: '민지 × Best Friend' }
  ];
  
  const todayIndex = dayOfYear % luckyIdols.length;
  return luckyIdols[todayIndex];
}

function updateTodayComboText() {
  const todayCombo = getTodayLuckyCombo();
  const todayTextEl = q('#today-combo-text');
  if (todayTextEl) {
    todayTextEl.textContent = todayCombo.text;
  }
}

function scrollToForm() {
  const formCard = q('.card.polaroid');
  if (formCard) {
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Focus on name input after scroll
    setTimeout(() => {
      q('#myName').focus();
    }, 500);
  }
}

// 🚀 Phase 1-2: VS Mode Functions
function populateVSIdolSelect(idols) {
  const vsSelect = q('#vs-idol');
  if (!vsSelect) return;
  
  const placeholder = '<option value="">Select an idol...</option>';
  const options = idols.map(i => `<option value="${i.name_kr}">${i.name_kr} (${i.name_en}) - ${i.group}</option>`).join('');
  setHTML(vsSelect, placeholder + options);
}

async function startVSBattle() {
  const name1 = q('#vs-name1').value.trim();
  const name2 = q('#vs-name2').value.trim();
  const idolName = q('#vs-idol').value;
  
  // Validation
  if (!name1 || !name2) {
    alert('Please enter both names! 두 이름을 모두 입력해주세요!');
    return;
  }
  
  if (!idolName) {
    alert('Please select an idol! 아이돌을 선택해주세요!');
    return;
  }
  
  if (name1 === name2) {
    alert('Please enter different names! 다른 이름을 입력해주세요!');
    return;
  }
  
  // Get idol data
  const idol = await resolveIdol(idolName);
  if (!idol) {
    alert('Idol not found! 아이돌을 찾을 수 없습니다!');
    return;
  }
  
  // Generate chemistry for both
  const result1 = await generate({ 
    myName: name1, 
    idol, 
    genderPref: 'auto', 
    relation: 'friend' 
  });
  
  const result2 = await generate({ 
    myName: name2, 
    idol, 
    genderPref: 'auto', 
    relation: 'friend' 
  });
  
  // Track VS battle event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'vs_battle', {
      'event_category': 'engagement',
      'event_label': `${idol.group} - ${idol.name_kr}`,
      'value': 1
    });
  }
  
  // Display results
  displayVSResults(name1, result1, name2, result2, idol);
  
  // Scroll to results
  const vsResults = q('#vs-results');
  if (vsResults) {
    vsResults.style.display = 'block';
    setTimeout(() => {
      vsResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

function displayVSResults(name1, result1, name2, result2, idol) {
  const chem1 = result1.chemistry;
  const chem2 = result2.chemistry;
  const winner = chem1 > chem2 ? name1 : chem2 > chem1 ? name2 : 'TIE';
  const diff = Math.abs(chem1 - chem2);
  
  let battleCommentary = '';
  if (winner === 'TIE') {
    battleCommentary = `🤝 It's a perfect tie! Both have ${chem1}% chemistry with ${idol.name_kr}!`;
  } else if (diff < 5) {
    battleCommentary = `🔥 Super close match! ${winner} wins by just ${diff}%!`;
  } else if (diff < 10) {
    battleCommentary = `✨ ${winner} wins with a ${diff}% lead!`;
  } else {
    battleCommentary = `🏆 ${winner} dominates with ${diff}% higher chemistry!`;
  }
  
  const resultsHTML = `
    <div style="text-align: center; margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, rgba(255,46,139,.1), rgba(180,144,255,.1)); border-radius: 8px;">
      <p style="font-size: 1.2rem; font-weight: 700; margin: 0; color: var(--text);">
        ${battleCommentary}
      </p>
    </div>
    
    <div class="vs-results-grid" style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: stretch;">
      <!-- Player 1 Results -->
      <div style="padding: 20px; background: ${chem1 > chem2 ? 'linear-gradient(135deg, rgba(255,215,0,.2), rgba(255,46,139,.1))' : 'var(--chip)'}; border-radius: 12px; border: 2px solid ${chem1 > chem2 ? 'gold' : 'var(--border)'}; position: relative;">
        ${chem1 > chem2 ? '<div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: gold; color: #000; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 0.8rem;">🏆 WINNER</div>' : ''}
        <div style="text-align: center; margin-bottom: 12px;">
          <h4 style="margin: 0; font-size: 1.3rem;">${escapeHtml(name1)}</h4>
        </div>
        <div style="margin: 12px 0;">
          <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 4px;">Korean Name</div>
          <div style="font-weight: 600; font-size: 1.1rem;">${result1.sameName.full_kr}</div>
          <div style="font-size: 0.9rem; color: var(--muted);">${result1.sameName.full_en}</div>
        </div>
        <div style="margin-top: 16px; text-align: center;">
          <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 4px;">Chemistry Score</div>
          <div style="font-size: 2.5rem; font-weight: 900; color: var(--accent);">${chem1}%</div>
        </div>
      </div>
      
      <!-- VS Divider (Desktop) -->
      <div class="vs-results-divider" style="display: flex; align-items: center; justify-content: center;">
        <div style="font-size: 2rem; font-weight: 900; color: var(--accent); text-shadow: 2px 2px 0 var(--accent-2); transform: rotate(10deg);">
          VS
        </div>
      </div>
      
      <!-- VS Divider (Mobile) -->
      <div class="vs-results-divider-mobile" style="display: none; justify-content: center; margin: 12px 0;">
        <span style="font-size: 1.5rem; font-weight: 900; color: var(--accent); text-shadow: 2px 2px 0 var(--accent-2); transform: rotate(10deg);">VS</span>
      </div>
      
      <!-- Player 2 Results -->
      <div style="padding: 20px; background: ${chem2 > chem1 ? 'linear-gradient(135deg, rgba(255,215,0,.2), rgba(255,46,139,.1))' : 'var(--chip)'}; border-radius: 12px; border: 2px solid ${chem2 > chem1 ? 'gold' : 'var(--border)'}; position: relative;">
        ${chem2 > chem1 ? '<div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: gold; color: #000; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 0.8rem;">🏆 WINNER</div>' : ''}
        <div style="text-align: center; margin-bottom: 12px;">
          <h4 style="margin: 0; font-size: 1.3rem;">${escapeHtml(name2)}</h4>
        </div>
        <div style="margin: 12px 0;">
          <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 4px;">Korean Name</div>
          <div style="font-weight: 600; font-size: 1.1rem;">${result2.sameName.full_kr}</div>
          <div style="font-size: 0.9rem; color: var(--muted);">${result2.sameName.full_en}</div>
        </div>
        <div style="margin-top: 16px; text-align: center;">
          <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 4px;">Chemistry Score</div>
          <div style="font-size: 2.5rem; font-weight: 900; color: var(--accent);">${chem2}%</div>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 20px; padding: 16px; background: var(--chip); border-radius: 8px; text-align: center;">
      <p style="margin: 0; color: var(--muted);">
        🎤 Battle with <strong>${idol.name_kr}</strong> (${idol.name_en}) from ${idol.group}
      </p>
    </div>
    
    <div class="vs-button-row" style="margin-top: 16px; display: flex; gap: 8px; justify-content: center;">
      <button type="button" class="btn secondary" onclick="shareVSResult('${escapeHtml(name1)}', ${chem1}, '${escapeHtml(name2)}', ${chem2}, '${escapeHtml(idol.name_kr)}')">
        🚀 Share Result
      </button>
      <button type="button" class="btn secondary" onclick="rematchVS()">
        🔄 Rematch
      </button>
    </div>
  `;
  
  setHTML(q('#vs-results-content'), resultsHTML);
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, (ch)=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  }[ch]));
}

function shareVSResult(name1, chem1, name2, chem2, idolName) {
  const winner = chem1 > chem2 ? name1 : chem2 > chem1 ? name2 : 'TIE';
  const text = winner === 'TIE' 
    ? `⚔️ Chemistry Battle!\n\n${name1}: ${chem1}%\n${name2}: ${chem2}%\n🤝 It's a tie!\n\nWith ${idolName} | Try it yourself: ${window.location.href}`
    : `⚔️ Chemistry Battle!\n\n${name1}: ${chem1}%\n${name2}: ${chem2}%\n🏆 ${winner} wins!\n\nWith ${idolName} | Try it yourself: ${window.location.href}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'K-Pop Chemistry Battle',
      text: text
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      alert('Battle result copied to clipboard! 결과가 클립보드에 복사되었습니다!');
    });
  }
  
  // Track share
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share_vs_result', {
      'event_category': 'social',
      'event_label': 'vs_mode',
      'value': 1
    });
  }
}

function rematchVS() {
  // Clear inputs and hide results
  q('#vs-results').style.display = 'none';
  q('#vs-name1').value = '';
  q('#vs-name2').value = '';
  q('#vs-name1').focus();
}

// Make functions globally accessible
window.generateViralContent = generateViralContent;
window.copyViralContent = copyViralContent;
window.shareViralContent = shareViralContent;
window.createNameCard = createNameCard;
window.generateHashtags = generateHashtags;
window.createBio = createBio;
window.generateUsername = generateUsername;
window.copyUGCContent = copyUGCContent;
window.shareUGCContent = shareUGCContent;
window.shareToInstagram = shareToInstagram;
window.shareToFacebook = shareToFacebook;
window.shareToTwitter = shareToTwitter;
window.copyShareText = copyShareText;
window.shareToSnapchat = shareToSnapchat;
window.shareToDiscord = shareToDiscord;
window.shareToWhatsApp = shareToWhatsApp;
window.shareToTelegram = shareToTelegram;
window.shareToPinterest = shareToPinterest;
window.shareToReddit = shareToReddit;
window.shareToTikTok = shareToTikTok;

// 🚀 Phase 1: Quick Generate functions
window.quickGenerate = quickGenerate;
window.quickGenerateToday = quickGenerateToday;
window.quickGenerateRandom = quickGenerateRandom;
window.scrollToForm = scrollToForm;
window.syncNameToMainForm = syncNameToMainForm;
window.syncNameToQuickStart = syncNameToQuickStart;


// 🚀 Phase 1-2: VS Mode functions
window.startVSBattle = startVSBattle;
window.shareVSResult = shareVSResult;
window.rematchVS = rematchVS;

// 🚀 Phase 1-3: History/Favorites functions
window.toggleHistoryView = toggleHistoryView;
window.toggleFavoritesView = toggleFavoritesView;
window.addHistoryToFavorites = addHistoryToFavorites;
window.removeFavoriteByIndex = removeFavoriteByIndex;
window.regenerateFromHistory = regenerateFromHistory;
window.clearHistory = clearHistory;
window.clearFavorites = clearFavorites;

// ========== 🍔 Mobile Menu Functions ==========
function toggleMobileMenu() {
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const body = document.body;
  
  if (!mobileNav || !overlay || !toggle) return;
  
  mobileNav.classList.toggle('active');
  overlay.classList.toggle('active');
  toggle.classList.toggle('active');
  body.classList.toggle('mobile-menu-open');
}

function closeMobileMenu() {
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const body = document.body;
  
  if (!mobileNav || !overlay || !toggle) return;
  
  mobileNav.classList.remove('active');
  overlay.classList.remove('active');
  toggle.classList.remove('active');
  body.classList.remove('mobile-menu-open');
}

// ESC 키로 메뉴 닫기
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

// Expose mobile menu functions globally
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

// ========== 🎨 Theme Toggle ==========
const THEME_KEY = 'kitsch-theme';

// Apply theme immediately to prevent flash
(function applyThemeImmediately() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.body.classList.remove('kitsch-light', 'kitsch-dark');
  document.body.classList.add(saved === 'dark' ? 'kitsch-dark' : 'kitsch-light');
})();

function applyTheme(mode) {
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');
  
  body.classList.remove('kitsch-light', 'kitsch-dark');
  body.classList.add(mode === 'dark' ? 'kitsch-dark' : 'kitsch-light');
  localStorage.setItem(THEME_KEY, mode);
  
  if (toggle) {
    toggle.textContent = 'Kitsch: ' + (mode === 'dark' ? 'Dark' : 'Light');
  }
  
  // Update theme-color meta tag
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', mode === 'dark' ? '#0E0E10' : '#FF2E8B');
  }
}

function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Update button text
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  if (toggle) {
    toggle.textContent = 'Kitsch: ' + (saved === 'dark' ? 'Dark' : 'Light');
  }
  
  // Add click event listener
  if (toggle) {
    toggle.addEventListener('click', function() {
      const next = body.classList.contains('kitsch-dark') ? 'light' : 'dark';
      applyTheme(next);
    });
  }
}

// Wait for header to be loaded before initializing theme toggle
function waitForThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    initThemeToggle();
  } else {
    // Retry after a short delay if toggle button is not yet in DOM
    setTimeout(waitForThemeToggle, 100);
  }
}

init();
initHistoryFavorites();
initFavoriteButton();
updateTodayComboText(); // Update today's lucky combo on load
waitForThemeToggle(); // Initialize theme toggle
