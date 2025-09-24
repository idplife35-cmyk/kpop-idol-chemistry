// Simple i18n module with DOM binding and helpers

const MESSAGES = {
  en: {
    'meta.title': 'KPOP Idol Chemistry Name Generator',
    'ui.language': 'Language',
    'main.h1': '🎀💖 K‑Pop Idol Chemistry Name Generator ✨',
    'main.lead': 'Create a perfect chemistry name with your favorite idol.',
    'nav.aria': 'Quick links by group',

    'form.myName.label': 'My Name',
    'form.myName.placeholder': 'e.g., Sophia',
    'form.idol.label': 'Favorite Idol',
    'form.idol.placeholder': 'e.g., Jungkook, Minji, Jennie...',
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
    'faq.a1.p1': 'The generator creates two names using the idol you pick and a style preset.',
    'faq.a1.li1': "Same-name: a random Korean surname + the idol's Korean name (e.g., Kim + Jungkook).",
    'faq.a1.li2': 'Styled-name: builds a new given name using syllable pools tuned per relationship type.',
    'faq.a1.p2': 'Results are deterministic: the same inputs produce the same outputs.',
    'faq.q2': 'What is the chemistry score?',
    'faq.a2.p1': "A fun, seeded score between 70–100 based on your inputs. It's not a real compatibility measure.",
    'faq.q3': 'How does the Gender option work?',
    'faq.a3.p1': 'Male/Female use different syllable pools for styling. Auto tries to infer from your name or the idol.',
    'faq.a3.li1': 'English names: simple lists (e.g., Sophia/Liam) guide the guess.',
    'faq.a3.li2': 'Korean names: the last character heuristic helps choose likely gender.',
    'faq.a3.li3': "If unknown, the idol's gender is used as a fallback.",
    'faq.q4': "How do I search idols? What’s included?",
    'faq.a4.p1': 'Type in Korean or English. Suggestions appear, and fuzzy matching helps with small typos.',
    'faq.a4.p2': 'The list covers popular groups only. To expand it, edit the data file below.',
    'faq.q5': 'Privacy: is anything stored or sent?',
    'faq.a5.p1': "Everything runs in your browser. We don't upload your inputs to a server.",
    'faq.a5.li1': 'Only your language preference is saved in localStorage.',
    'faq.q6': 'Why show both Korean and English names?',
    'faq.a6.p1': 'This site supports international users. English names are romanized using a simplified mapping.',
    'faq.q7': 'Can I use this offline? Any requirements?',
    'faq.a7.p1': "Use a local or web server; opening the file directly won't work for modules or data fetches.",
    'faq.a7.li1': 'Examples: VS Code Live Server, or python3 -m http.server',
    'faq.a7.p2': "Full offline mode isn't supported because the site fetches data files dynamically.",
    'faq.q8': 'How do I change language?',
    'faq.a8.p1': 'Use the language selector at the top-right. The page updates instantly and remembers your choice.',
    'footer.noscript': 'JavaScript is required to use this page.',

    'header.myName': 'Your Name',
    'header.idol': 'Favorite Idol',
    'result.englishLabel': 'English Name',
    'result.chemistry': 'Chemistry',
    'result.comment': 'Comment',

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
  },
  ko: {
    'meta.title': 'KPOP 아이돌 케미 이름 생성기',
    'ui.language': '언어',
    'main.h1': '🎀💖 KPOP 아이돌 케미 이름 생성기 ✨',
    'main.lead': '좋아하는 아이돌과 어울리는 이름을 만들어 보세요.',
    'nav.aria': '그룹별 바로가기',

    'form.myName.label': '내 이름',
    'form.myName.placeholder': '예: Sophia',
    'form.idol.label': '좋아하는 아이돌',
    'form.idol.placeholder': '예: 정국, 민지, 제니...',
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
    'faq.a1.p1': '선택한 아이돌과 스타일 프리셋을 이용해 두 가지 이름을 만듭니다.',
    'faq.a1.li1': "동명이인 스타일: 한국 성씨 + 아이돌의 한글 이름 (예: 김 + 정국)",
    'faq.a1.li2': '스타일 변형: 관계 타입에 맞춘 음절 풀로 새로운 이름을 구성합니다.',
    'faq.a1.p2': '결과는 결정적입니다. 같은 입력이면 항상 같은 결과가 나옵니다.',
    'faq.q2': '케미 지수는 무엇인가요?',
    'faq.a2.p1': '입력값을 바탕으로 70–100 사이에서 계산되는 재미 요소입니다. 실제 궁합 지표는 아닙니다.',
    'faq.q3': '성별 옵션은 어떻게 동작하나요?',
    'faq.a3.p1': '남/여는 서로 다른 음절 풀을 사용합니다. 자동은 이름이나 아이돌 정보를 보고 추정합니다.',
    'faq.a3.li1': '영문 이름: 간단한 예시 목록(예: Sophia/Liam)으로 추정합니다.',
    'faq.a3.li2': '한글 이름: 마지막 글자 기준의 간단한 휴리스틱을 사용합니다.',
    'faq.a3.li3': '판단이 어려우면 아이돌의 성별을 기본값으로 사용합니다.',
    'faq.q4': '아이돌 검색은 어떻게 하나요? 수록 범위는?',
    'faq.a4.p1': '한글 또는 영어로 입력하면 제안 목록이 보이고, 오타가 있어도 퍼지 매칭이 보완합니다.',
    'faq.a4.p2': '인기 그룹 위주로 수록되어 있습니다. 더 추가하려면 아래 데이터 파일을 수정하세요.',
    'faq.q5': '개인정보는 저장되거나 전송되나요?',
    'faq.a5.p1': '모든 처리는 브라우저에서만 이뤄집니다. 입력값을 서버로 전송하지 않습니다.',
    'faq.a5.li1': '언어 설정만 로컬스토리지에 저장합니다.',
    'faq.q6': '한글/영문 표기를 모두 보여주는 이유는?',
    'faq.a6.p1': '해외 이용자도 고려했기 때문입니다. 영문 표기는 단순화된 로마자 변환을 사용합니다.',
    'faq.q7': '오프라인 사용 가능? 실행 조건은?',
    'faq.a7.p1': '파일을 직접 열면 동작하지 않습니다. 로컬/웹 서버에서 열어주세요.',
    'faq.a7.li1': '예: VS Code Live Server, 또는 python3 -m http.server',
    'faq.a7.p2': '데이터 파일을 동적으로 가져오므로 완전한 오프라인 모드는 지원하지 않습니다.',
    'faq.q8': '언어는 어디서 바꾸나요?',
    'faq.a8.p1': '우측 상단의 언어 선택 메뉴를 사용하세요. 즉시 반영되며 설정이 기억됩니다.',
    'footer.noscript': '이 페이지를 사용하려면 JavaScript가 필요합니다.',

    'header.myName': '당신의 이름',
    'header.idol': '좋아하는 아이돌',
    'result.englishLabel': '영문 표기',
    'result.chemistry': '케미 지수',
    'result.comment': '코멘트',

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
