
import { q, on, setHTML, ariaLive } from './ui/dom.js';
import { renderHeader, renderResultCard, renderShareBlock } from './ui/templates.js';
import { relationUI, t, getLang } from './i18n.js';
import { getIdols, resolveIdol } from './data/idols.js';
import { generate } from './generator/engine.js';

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

  on(q('#form'), 'submit', async (e)=>{
    e.preventDefault();
    
    // Store current scroll position
    const currentScrollY = window.scrollY;
    
    const myName = q('#myName').value.trim();
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

    setHTML(q('#header'), header);
    setHTML(q('#results'), sameCard + styledCard + shareBlock);

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
    gender: gender,
    relation: relation,
    koreanName: koreanName,
    englishName: englishName,
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
  const historyContainer = q('#history-container');
  if (!historyContainer) return;

  if (history.length === 0) {
    historyContainer.innerHTML = '<p class="text-center text-muted">No history yet. Generate some names to see them here!</p>';
    return;
  }

  const historyHTML = history.slice(0, 10).map(item => `
    <div class="history-item">
      <div class="history-content">
        <div class="history-names">
          <strong>${item.koreanName}</strong> (${item.englishName})
        </div>
        <div class="history-details">
          ${item.myName} + ${item.idol} (${item.group}) • ${item.relation} • ${item.chemistry}%
        </div>
        <div class="history-time">
          ${new Date(item.timestamp).toLocaleString()}
        </div>
      </div>
      <div class="history-actions">
        <button class="btn btn-sm btn-outline-primary" onclick="regenerateFromHistory('${item.myName}', '${item.idol}', '${item.gender}', '${item.relation}')">
          <i class="fas fa-redo"></i> Regenerate
        </button>
        <button class="btn btn-sm btn-outline-success" onclick="saveToFavorites(${JSON.stringify(item).replace(/"/g, '&quot;')})">
          <i class="fas fa-heart"></i> Save
        </button>
      </div>
    </div>
  `).join('');

  historyContainer.innerHTML = historyHTML;
}

function updateFavoritesUI() {
  const favorites = getFavorites();
  const favoritesContainer = q('#favorites-container');
  if (!favoritesContainer) return;

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p class="text-center text-muted">No favorites yet. Save some names to see them here!</p>';
    return;
  }

  const favoritesHTML = favorites.map(item => `
    <div class="favorite-item">
      <div class="favorite-content">
        <div class="favorite-names">
          <strong>${item.koreanName}</strong> (${item.englishName})
        </div>
        <div class="favorite-details">
          ${item.myName} + ${item.idol} (${item.group}) • ${item.relation} • ${item.chemistry}%
        </div>
        <div class="favorite-time">
          Saved ${new Date(item.timestamp).toLocaleString()}
        </div>
      </div>
      <div class="favorite-actions">
        <button class="btn btn-sm btn-outline-primary" onclick="regenerateFromHistory('${item.myName}', '${item.idol}', '${item.gender}', '${item.relation}')">
          <i class="fas fa-redo"></i> Regenerate
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromFavorites(${JSON.stringify(item).replace(/"/g, '&quot;')})">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    </div>
  `).join('');

  favoritesContainer.innerHTML = favoritesHTML;
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
  if (confirm('Are you sure you want to clear all favorites?')) {
    localStorage.removeItem('kpopNameFavorites');
    updateFavoritesUI();
  }
}

// Initialize history and favorites UI on page load
function initHistoryFavorites() {
  updateHistoryUI();
  updateFavoritesUI();
}

init();
initHistoryFavorites();
