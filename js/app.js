
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
      window.open(shareUrl, '_blank', 'noopener');
    });
  }

  const copyBtn = root.querySelector('[data-share="copy"]');
  if(copyBtn){
    on(copyBtn, 'click', async ()=>{
      const payload = `${text}\n${url}`;
      try {
        const ok = await copyToClipboard(payload);
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

init();
