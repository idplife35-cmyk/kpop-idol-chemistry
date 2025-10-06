// Simple i18n module with DOM binding and helpers

const MESSAGES = {
  en: {
    'meta.title': 'KPOP Idol Chemistry Name Generator',
    'ui.language': 'Language',
    'ui.backToMain': '← Back to Main',
    'main.h1': '🎀💖 K‑Pop Idol Chemistry Name Generator ✨',
    'main.lead': 'Create a perfect chemistry name with your favorite idol.',
    'nav.aria': 'Quick links by group',

    'form.myName.label': 'My Name',
    'form.myName.placeholder': 'e.g., Sophia',
    'form.idol.label': 'Favorite Idol',
    'form.idol.placeholder': 'e.g., Jungkook, Minji, Jennie...',
    'form.idol.selectPrompt': 'Select a member',
    'form.gender.label': 'Gender',
    'form.gender.male': 'Male',
    'form.gender.female': 'Female',
    'form.gender.auto': 'Auto',
    'form.relation.label': 'Relationship Type',
    'form.relation.friend': 'Best Friend',
    'form.relation.partner': 'Stage Partner',
    'form.relation.classmate': 'Classmate',
    'form.relation.drama': 'Drama Lead',
    'form.relation.lover': 'Lover',
    'form.submit': 'Generate Chemistry Name',
    'form.reset': 'Reset',

    'faq.title': 'FAQ',
    'faq.lead': 'Answers to common questions about how it works.',
    'faq.q1': 'How are the names generated?',
    'faq.a1.p1': 'We blend your input name with curated SajaBoys member data, balancing Hangul syllables, romanization, and stage-ready keywords for a memorable idol persona.',
    'faq.a1.li1': 'Hangul, romanized, and English variants stay synchronized so your nickname works across platforms.',
    'faq.a1.li2': 'Weightings for chemistry tropes, debut themes, and cute emojis keep things true to SajaBoys lore.',
    'faq.a1.p2': 'Regenerate as often as you like—every spin gives you new title ideas for social bios, fan art captions, or fic characters.',
    'faq.q2': 'What is the chemistry score?',
    'faq.a2.p1': 'It is a playful 0–100 score that ranks how naturally your chosen relationship storyline matches the selected idol’s traits.',
    'faq.q3': 'How does the Gender option work?',
    'faq.a3.p1': 'Gender styling tweaks the balance of soft, neutral, and powerful syllables so your generated name fits any vibe.',
    'faq.a3.li1': '`Male` leans into bolder consonants and charismatic stage energy.',
    'faq.a3.li2': '`Female` favors melodic vowels and cute Hangul pairings.',
    'faq.a3.li3': '`Auto` mixes both for gender-neutral or switch concepts.',
    'faq.q4': "How do I search idols? What’s included?",
    'faq.a4.p1': 'The dropdown only lists official SajaBoys members pulled from our live idol dataset.',
    'faq.a4.p2': 'We frequently refresh it with unit changes, stage names, and collab appearances so you stay up to date.',
    'faq.q5': 'Privacy: is anything stored or sent?',
    'faq.a5.p1': 'No account, login, or analytics payloads are required for the generator to work.',
    'faq.a5.li1': 'All names stay on your device—inputs never leave the browser tab.',
    'faq.q6': 'Why show both Korean and English names?',
    'faq.a6.p1': 'Seeing both makes it easier to caption posts, match Hangul fan chants, and share names with international SajaBoys fans.',
    'faq.q7': 'Can I use this offline? Any requirements?',
    'faq.a7.p1': 'Yes—once the page loads the logic runs completely client side, so cached sessions still work.',
    'faq.a7.li1': 'Use a modern browser like Chrome, Edge, Safari, or Firefox for best performance.',
    'faq.a7.p2': 'Clearing your cache simply resets preferences such as the last idol you selected.',
    'faq.q8': 'How do I change language?',
    'faq.a8.p1': 'Switch between English and 한국어 using the selector at the top-right—content updates instantly without reloading.',
    'footer.noscript': 'JavaScript is required to use this page.',

    'header.myName': 'Your Name',
    'header.idol': 'Favorite Idol',
    'result.englishLabel': 'English Name',
    'result.chemistry': 'Chemistry',
    'result.comment': 'Comment',

    'share.title': 'Share your result',
    'share.subtitle': 'Let friends know about your new chemistry name!',
    'share.native': 'Share',
    'share.twitter': 'Share on X',
    'share.instagram': 'Share on Instagram',
    'share.copy': 'Copy share text',
    'share.copied': 'Copied to clipboard!',
    'share.error': 'Sharing failed. Please try again.',
    'share.cta': 'Try it here!',
    'share.instagramHint': 'Copied! Paste into Instagram when you post.',

    'alert.selectIdol': 'Please select a valid idol name.',

    // Relation UI
    'relation.friend.label': 'Best Friend Name',
    'relation.partner.label': 'Stage Partner Name',
    'relation.classmate.label': 'Classmate Name',
    'relation.drama.label': 'Drama Lead Name',
    'relation.lover.label': 'Lover Name',
    'relation.friend.phrases': ['Perfect bestie vibes!', 'True best-friend energy!'],
    'relation.partner.phrases': ['Stage chemistry masters!', 'Explosive synergy!'],
    'relation.classmate.phrases': ['Desk-partner energy!', 'The duo everyone sees together!'],
    'relation.drama.phrases': ['Drama main-lead chemistry!', 'Movie-like story arc!'],
    'relation.lover.phrases': ['Perfect couple chemistry!', 'Heart-fluttering vibe!', 'Fated chemistry!'],

    // Page-specific headings/leads
    'page.onlyGroup': '* Autocomplete shows this group only.',
    'page.onlyGroupSelect': '* Choose from this group only.',
    'page.bts.h1': '🎀💜 BTS Name Generator ✨',
    'page.bts.lead': 'Create an adorable Korean-style name that matches with BTS members.',
    'page.blackpink.h1': '🎀🩷 BLACKPINK Name Generator ✨',
    'page.blackpink.lead': 'Create an adorable Korean-style name that matches with BLACKPINK members.',
    'page.newjeans.h1': '🎀🩵 NewJeans Name Generator ✨',
    'page.newjeans.lead': 'Create an adorable Korean-style name that matches with NewJeans members.',
    'page.ive.h1': '🎀💖 IVE Name Generator ✨',
    'page.ive.lead': 'Create an adorable Korean-style name that matches with IVE members.',
    'page.huntrix.h1': '🎀💚 HUNTR/X Name Generator ✨',
    'page.huntrix.lead': 'Forge a cute Korean-style name that matches with HUNTR/X (K‑Pop Demon Hunters).',
    'page.sajaboys.h1': '🎀🦁 SajaBoys Name Generator ✨',
    'page.sajaboys.lead': 'Create a roaringly cute Korean-style name that matches with SajaBoys.',
    'page.sajaboys.overviewTitle': 'SajaBoys Chemistry Name Maker',
    'page.sajaboys.overviewP1': 'Mix your real name with every SajaBoys member’s Hangul and English stage identity to discover a debut-ready persona, matching surnames, and a playful chemistry score that reflects K-Pop partner vibes.',
    'page.sajaboys.overviewP2': 'Choose your favorite idol, ideal relationship dynamic, and preferred gender tone to unlock nickname ideas, romanized spellings, and profile snippets tailored for fanfic, socials, or roleplay.',
    'page.sajaboys.overviewP3.beforeBTS': 'Want to explore other groups? Try the ',
    'page.sajaboys.overviewP3.bts': 'BTS Name Generator',
    'page.sajaboys.overviewP3.middle': ' or our ',
    'page.sajaboys.overviewP3.newjeans': 'NewJeans Name Generator',
    'page.sajaboys.overviewP3.afterNJ': ' for even more idol chemistry combos.',
  },
  ko: {
    'meta.title': 'KPOP 아이돌 케미 이름 생성기',
    'ui.language': '언어',
    'ui.backToMain': '← 메인으로 돌아가기',
    'main.h1': '🎀💖 KPOP 아이돌 케미 이름 생성기 ✨',
    'main.lead': '좋아하는 아이돌과 어울리는 이름을 만들어 보세요.',
    'nav.aria': '그룹별 바로가기',

    'form.myName.label': '내 이름',
    'form.myName.placeholder': '예: Sophia',
    'form.idol.label': '좋아하는 아이돌',
    'form.idol.placeholder': '예: 정국, 민지, 제니...',
    'form.idol.selectPrompt': '멤버를 선택하세요',
    'form.gender.label': '성별 선택',
    'form.gender.male': '남자',
    'form.gender.female': '여자',
    'form.gender.auto': '자동',
    'form.relation.label': '관계 타입',
    'form.relation.friend': '절친',
    'form.relation.partner': '무대 파트너',
    'form.relation.classmate': '같은 반 친구',
    'form.relation.drama': '드라마 주인공',
    'form.relation.lover': '애인',
    'form.submit': '케미 이름 만들기',
    'form.reset': '초기화',

    'faq.title': 'FAQ',
    'faq.lead': '작동 방식에 대한 자주 묻는 질문입니다.',
    'faq.q1': '이름은 어떻게 만들어지나요?',
    'faq.a1.p1': '입력한 이름과 사자보이즈 멤버 데이터베이스를 조합해 한글 음절, 로마자 표기, 무대 키워드를 균형 있게 섞어 기억에 남는 아이돌 페르소나를 만듭니다.',
    'faq.a1.li1': '한글·로마자·영문 변형을 동시에 맞춰서 어떤 플랫폼에서도 닉네임이 자연스럽게 통합니다.',
    'faq.a1.li2': '케미 클리셰, 데뷔 콘셉트, 귀여운 이모지를 가중치로 적용해 사자보이즈 세계관을 살립니다.',
    'faq.a1.p2': '원하는 만큼 재생성해 보세요. 매번 새로운 소셜 소개글, 팬아트 캡션, 팬픽 캐릭터 아이디어를 얻을 수 있어요.',
    'faq.q2': '케미 지수는 무엇인가요?',
    'faq.a2.p1': '선택한 관계 스토리가 멤버 특성과 얼마나 잘 맞는지를 0~100점으로 재미있게 보여주는 지표입니다.',
    'faq.q3': '성별 옵션은 어떻게 동작하나요?',
    'faq.a3.p1': '성별 옵션은 부드러운 음절과 파워풀한 음절의 비율을 조정해 어떤 분위기에도 어울리는 이름을 만들어 줍니다.',
    'faq.a3.li1': '`Male`은 강한 자음과 카리스마 있는 무대 에너지를 강조합니다.',
    'faq.a3.li2': '`Female`은 부드러운 모음과 사랑스러운 한글 조합을 우선합니다.',
    'faq.a3.li3': '`Auto`는 두 스타일을 섞어 젠더 뉴트럴 혹은 전환 콘셉트를 구현합니다.',
    'faq.q4': '아이돌 검색은 어떻게 하나요? 수록 범위는?',
    'faq.a4.p1': '드롭다운에는 실시간 아이돌 데이터셋에서 가져온 공식 사자보이즈 멤버만 노출됩니다.',
    'faq.a4.p2': '유닛 변동, 활동명, 컬래버 소식이 생길 때마다 목록을 자주 갱신해 최신 정보를 유지합니다.',
    'faq.q5': '개인정보는 저장되거나 전송되나요?',
    'faq.a5.p1': '이름 생성기는 계정이나 로그인, 분석 데이터 없이도 작동합니다.',
    'faq.a5.li1': '입력한 모든 내용은 브라우저 안에만 머물고, 외부로 전송되지 않습니다.',
    'faq.q6': '한글/영문 표기를 모두 보여주는 이유는?',
    'faq.a6.p1': '한글과 영어를 함께 보여주면 게시물 캡션, 응원법, 국제 팬들과 공유할 때 훨씬 편해요.',
    'faq.q7': '오프라인 사용 가능? 실행 조건은?',
    'faq.a7.p1': '네. 페이지를 한 번 불러오면 로직이 전부 클라이언트에서 실행되어 캐시만 있어도 유지됩니다.',
    'faq.a7.li1': 'Chrome, Edge, Safari, Firefox처럼 최신 브라우저를 사용하면 가장 안정적입니다.',
    'faq.a7.p2': '캐시를 지우면 마지막으로 선택한 멤버 같은 사용자 설정만 초기화됩니다.',
    'faq.q8': '언어는 어디서 바꾸나요?',
    'faq.a8.p1': '오른쪽 상단 언어 선택기에서 English와 한국어를 즉시 전환할 수 있어요. 새로고침이 필요 없습니다.',
    'footer.noscript': '이 페이지를 사용하려면 JavaScript가 필요합니다.',

    'header.myName': '당신의 이름',
    'header.idol': '좋아하는 아이돌',
    'result.englishLabel': '영문 표기',
    'result.chemistry': '케미 지수',
    'result.comment': '코멘트',

    'share.title': '결과 공유하기',
    'share.subtitle': '친구들과 케미 이름을 나눠보세요!',
    'share.native': '공유하기',
    'share.twitter': 'X(트위터)에 공유',
    'share.instagram': '인스타그램에 공유',
    'share.copy': '공유 문구 복사',
    'share.copied': '클립보드에 복사했어요!',
    'share.error': '공유에 실패했어요. 다시 시도해 주세요.',
    'share.cta': '여기에서 직접 해보세요!',
    'share.instagramHint': '복사 완료! 인스타그램에 붙여넣어 보세요.',

    'alert.selectIdol': '아이돌 이름을 정확히 선택해주세요.',

    'relation.friend.label': '어울리는 절친 이름',
    'relation.partner.label': '어울리는 무대 파트너 이름',
    'relation.classmate.label': '어울리는 같은 반 친구 이름',
    'relation.drama.label': '드라마 속 주인공 이름',
    'relation.lover.label': '어울리는 애인 이름',
    'relation.friend.phrases': ['찰떡 단짝 케미!', '찐친 바이브!'],
    'relation.partner.phrases': ['무대 장인 케미!', '폭발적 시너지!'],
    'relation.classmate.phrases': ['같은 반 단짝 느낌!', '매일 같이 등교할 조합!'],
    'relation.drama.phrases': ['드라마 주연급 케미!', '영화 같은 전개!'],
    'relation.lover.phrases': ['완벽한 커플 케미!', '심쿵 케미!', '운명적 케미!'],

    // Page-specific headings/leads
    'page.onlyGroup': '* 이 페이지는 해당 그룹 멤버만 자동완성에 노출됩니다.',
    'page.onlyGroupSelect': '* 이 페이지는 해당 그룹 멤버만 선택할 수 있습니다.',
    'page.bts.h1': '🎀💜 BTS 전용 이름 생성기 ✨',
    'page.bts.lead': 'BTS 멤버와 잘 어울리는 한국식 이름을 만들어 보세요.',
    'page.blackpink.h1': '🎀🩷 BLACKPINK 전용 이름 생성기 ✨',
    'page.blackpink.lead': 'BLACKPINK 멤버와 잘 어울리는 한국식 이름을 만들어 보세요.',
    'page.newjeans.h1': '🎀🩵 NewJeans 전용 이름 생성기 ✨',
    'page.newjeans.lead': 'NewJeans 멤버와 잘 어울리는 한국식 이름을 만들어 보세요.',
    'page.ive.h1': '🎀💖 IVE 전용 이름 생성기 ✨',
    'page.ive.lead': 'IVE 멤버와 잘 어울리는 한국식 이름을 만들어 보세요.',
    'page.huntrix.h1': '🎀💚 HUNTR/X 전용 이름 생성기 ✨',
    'page.huntrix.lead': '케이팝데몬헌터스 HUNTR/X와 잘 어울리는 한국식 이름을 만들어 보세요.',
    'page.sajaboys.h1': '🎀🦁 사자보이즈 전용 이름 생성기 ✨',
    'page.sajaboys.lead': '사자보이즈와 잘 어울리는 한국식 이름을 만들어 보세요.',
    'page.sajaboys.overviewTitle': '사자보이즈 케미 이름 메이커',
    'page.sajaboys.overviewP1': '실제 이름과 사자보이즈 멤버의 한글·영문 무대 정보를 섞어 데뷔 감성의 페르소나, 잘 어울리는 성씨, 케이팝 파트너 바이브를 담은 케미 지수를 찾아보세요.',
    'page.sajaboys.overviewP2': '좋아하는 멤버와 관계 유형, 선호하는 성별 분위기를 선택하면 팬픽, SNS, 롤플레잉에 딱 맞는 닉네임과 로마자 표기를 추천합니다.',
    'page.sajaboys.overviewP3.beforeBTS': '다른 그룹도 궁금하다면 ',
    'page.sajaboys.overviewP3.bts': 'BTS 이름 생성기',
    'page.sajaboys.overviewP3.middle': ' 또는 ',
    'page.sajaboys.overviewP3.newjeans': 'NewJeans 이름 생성기',
    'page.sajaboys.overviewP3.afterNJ': '를 이용해 더 많은 아이돌 케미 조합을 만나보세요.',
  }
};

let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en';

export function getLang(){ return currentLang; }

export function t(key){
  const en = MESSAGES.en[key];
  const s = (MESSAGES[currentLang] && MESSAGES[currentLang][key]) ?? en;
  return (s == null) ? key : s;
}

export function relationUI(){
  return {
    friend:   { icon: '👯', label: t('relation.friend.label'),   copies: t('relation.friend.phrases') },
    partner:  { icon: '🎤', label: t('relation.partner.label'), copies: t('relation.partner.phrases') },
    classmate:{ icon: '🏫', label: t('relation.classmate.label'), copies: t('relation.classmate.phrases') },
    drama:    { icon: '🎬', label: t('relation.drama.label'),   copies: t('relation.drama.phrases') },
    lover:    { icon: '❤️', label: t('relation.lover.label'),   copies: t('relation.lover.phrases') }
  };
}

function setAttrTranslations(){
  // Text content
  document.querySelectorAll('[data-i18n]')
    .forEach(el => { const key = el.getAttribute('data-i18n'); if(key) el.textContent = t(key); });
  // Placeholder
  document.querySelectorAll('[data-i18n-placeholder]')
    .forEach(el => { const key = el.getAttribute('data-i18n-placeholder'); if(key) el.setAttribute('placeholder', t(key)); });
  // Aria label
  document.querySelectorAll('[data-i18n-aria-label]')
    .forEach(el => { const key = el.getAttribute('data-i18n-aria-label'); if(key) el.setAttribute('aria-label', t(key)); });
  // Title element
  const titleEl = document.querySelector('title[data-i18n]');
  if(titleEl){ titleEl.textContent = t(titleEl.getAttribute('data-i18n')); }
}

export function setLang(lang){
  currentLang = (lang === 'ko') ? 'ko' : 'en';
  try { localStorage.setItem('lang', currentLang); } catch {}
  document.documentElement.setAttribute('lang', currentLang);
  setAttrTranslations();
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
}

function initLang(){
  // Default to English unless user has stored preference
  document.documentElement.setAttribute('lang', currentLang);
  setAttrTranslations();

  const sel = document.getElementById('lang-select');
  if(sel){
    sel.value = currentLang;
    sel.addEventListener('change', () => setLang(sel.value));
  }
}

// Apply on DOM ready
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initLang);
} else {
  initLang();
}

export default { t, setLang, getLang, relationUI };
