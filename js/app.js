
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

init();
initHistoryFavorites();
initFavoriteButton();
