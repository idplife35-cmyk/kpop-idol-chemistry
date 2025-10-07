// Simple i18n module with DOM binding and helpers

const MESSAGES = {
  en: {
    'meta.title': 'KPOP Idol Chemistry Name Generator',
    'ui.language': 'Language',
    'ui.backToMain': '← Back to Main',
    'main.h1': '🎀💖 K‑Pop Idol Chemistry Name Generator ✨',
    'main.lead': 'Create a perfect chemistry name with your favorite idol.',
    'main.description': 'Create unique Korean names with your favorite K-Pop idols! Our name generator supports multiple groups including BTS, BLACKPINK, NewJeans, IVE, and more. Perfect for fanfiction, roleplay, and creative writing.',
    'nav.aria': 'Quick links by group',
    
    // Hero section
    'hero.eyebrow': 'K-Pop Alter Ego',
    'hero.meta1': 'Bias-worthy',
    'hero.meta2': 'Stage-ready',
    'hero.meta3': 'Main character energy',
    'hero.checklist1': 'K-Pop ready',
    'hero.checklist2': 'Stage perfect',
    'hero.checklist3': 'Idol vibes',
    
    // Navigation
    'nav.generator': 'Generator',
    'nav.groups': 'Groups',
    'nav.guide': 'Guide',
    
    // Dividers
    'divider.groups': 'Popular K-Pop Groups',
    'divider.create': 'Create Your Chemistry Name',
    
    // Cards
    'card.tape': 'Name Generator',
    'card.title': 'Name Generator Form',
    'results.title': 'Your Chemistry Results',
    
    // Guide section
    'guide.title': 'How to Use Our K-Pop Name Generator',
    'guide.lead': 'Follow these simple steps to create your perfect K-Pop chemistry name:',
    'guide.step1.title': 'Enter Your Name',
    'guide.step1.desc': 'Type your real name in the input field above',
    'guide.step2.title': 'Choose Your Group',
    'guide.step2.desc': 'Select from BTS, BLACKPINK, NewJeans, IVE, HUNTR/X, or SajaBoys',
    'guide.step3.title': 'Generate Names',
    'guide.step3.desc': 'Click the "Generate Name" button to create your chemistry name',
    'guide.step4.title': 'Try Different Options',
    'guide.step4.desc': 'Generate multiple times to find your favorite combination',
    'guide.step5.title': 'Share Your Results',
    'guide.step5.desc': 'Copy and share your new K-Pop name with friends!',
    
    // Tips section
    'tips.title': 'Tips for Better Results',
    'tips.lead': 'Get the most out of your K-Pop name generation experience:',
    'tips.tip1.title': 'Use Your Full Name',
    'tips.tip1.desc': 'Enter your complete name for more authentic results',
    'tips.tip2.title': 'Try Different Groups',
    'tips.tip2.desc': 'Each group has a unique naming style and energy',
    'tips.tip3.title': 'Generate Multiple Times',
    'tips.tip3.desc': 'Our algorithm creates different combinations each time',
    'tips.tip4.title': 'Consider Your Personality',
    'tips.tip4.desc': 'Choose the group that best matches your vibe',
    'tips.tip5.title': 'Have Fun!',
    'tips.tip5.desc': 'The best names come when you\'re enjoying the process',
    
    // Why section
    'why.title': 'Why Use Our K-Pop Name Generator?',
    'why.lead': 'Our advanced Korean name generator creates authentic-sounding names that match your favorite K-Pop idols\' style. Whether you\'re writing fanfiction, creating roleplay characters, or just having fun, our generator provides:',
    'why.feature1.title': 'Authentic Korean Names:',
    'why.feature1.desc': 'Real Korean surname and given name combinations',
    'why.feature2.title': 'Chemistry Scores:',
    'why.feature2.desc': 'Fun compatibility ratings between you and your chosen idol',
    'why.feature3.title': 'Multiple Relationship Types:',
    'why.feature3.desc': 'Best friend, stage partner, lover, and more',
    'why.feature4.title': 'Gender-Specific Generation:',
    'why.feature4.desc': 'Names tailored to your preferred gender style',
    'why.feature5.title': 'Popular K-Pop Groups:',
    'why.feature5.desc': 'Support for BTS, BLACKPINK, NewJeans, IVE, and more',
    'why.explore.title': 'Explore More Name Generators',
    'why.explore.lead': 'Try our specialized generators for different K-Pop groups:',
    
    // About section
    'about.title': 'About K-Pop Name Chemistry',
    'about.lead': 'K-Pop names often follow specific patterns and cultural significance. Our generator understands these nuances:',
    'about.point1.title': 'Korean Naming Traditions:',
    'about.point1.desc': 'Surnames like Kim, Lee, Park are most common',
    'about.point2.title': 'Stage Name Patterns:',
    'about.point2.desc': 'Many idols use stage names that reflect their personality',
    'about.point3.title': 'Cultural Meanings:',
    'about.point3.desc': 'Korean names often have beautiful meanings related to nature, virtues, or aspirations',
    'about.point4.title': 'Group Chemistry:',
    'about.point4.desc': 'Names that work well together in K-Pop groups often share similar sounds or meanings',
    'about.point5.title': 'International Appeal:',
    'about.point5.desc': 'Modern K-Pop names blend Korean tradition with global appeal',

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
    'share.instagram': 'Instagram',
    'share.tiktok': 'TikTok',
    'share.twitter': 'X (Twitter)',
    'share.snapchat': 'Snapchat',
    'share.facebook': 'Facebook',
    'share.discord': 'Discord',
    'share.whatsapp': 'WhatsApp',
    'share.telegram': 'Telegram',
    'share.pinterest': 'Pinterest',
    'share.reddit': 'Reddit',
    'share.copy': 'Copy Text',
    'share.copied': 'Copied to clipboard!',
    'share.error': 'Sharing failed. Please try again.',
    'share.cta': 'Try it here!',
    'share.hint': '💡 Perfect for your social media bio or K-Pop fan content!',

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
    'main.description': '좋아하는 K-Pop 아이돌과 함께 독특한 한국식 이름을 만들어보세요! BTS, BLACKPINK, NewJeans, IVE 등 다양한 그룹을 지원합니다. 팬픽션, 롤플레이, 창작에 완벽합니다.',
    'nav.aria': '그룹별 바로가기',
    
    // Hero section
    'hero.eyebrow': 'K-Pop 알터 에고',
    'hero.meta1': '바이어스급',
    'hero.meta2': '무대 완성',
    'hero.meta3': '주인공 에너지',
    'hero.checklist1': 'K-Pop 준비완료',
    'hero.checklist2': '무대 완벽',
    'hero.checklist3': '아이돌 바이브',
    
    // Navigation
    'nav.generator': '생성기',
    'nav.groups': '그룹',
    'nav.guide': '가이드',
    
    // Dividers
    'divider.groups': '인기 K-Pop 그룹',
    'divider.create': '케미 이름 만들기',
    
    // Cards
    'card.tape': '이름 생성기',
    'card.title': '이름 생성기 폼',
    'results.title': '케미 결과',
    
    // Guide section
    'guide.title': 'K-Pop 이름 생성기 사용법',
    'guide.lead': '완벽한 K-Pop 케미 이름을 만들기 위한 간단한 단계를 따라해보세요:',
    'guide.step1.title': '이름 입력',
    'guide.step1.desc': '위 입력 필드에 실제 이름을 입력하세요',
    'guide.step2.title': '그룹 선택',
    'guide.step2.desc': 'BTS, BLACKPINK, NewJeans, IVE, HUNTR/X, SajaBoys 중에서 선택하세요',
    'guide.step3.title': '이름 생성',
    'guide.step3.desc': '"이름 생성" 버튼을 클릭하여 케미 이름을 만드세요',
    'guide.step4.title': '다양한 옵션 시도',
    'guide.step4.desc': '여러 번 생성하여 마음에 드는 조합을 찾아보세요',
    'guide.step5.title': '결과 공유',
    'guide.step5.desc': '새로운 K-Pop 이름을 복사하여 친구들과 공유하세요!',
    
    // Tips section
    'tips.title': '더 나은 결과를 위한 팁',
    'tips.lead': 'K-Pop 이름 생성 경험을 최대한 활용하세요:',
    'tips.tip1.title': '전체 이름 사용',
    'tips.tip1.desc': '더 진정성 있는 결과를 위해 완전한 이름을 입력하세요',
    'tips.tip2.title': '다양한 그룹 시도',
    'tips.tip2.desc': '각 그룹마다 고유한 네이밍 스타일과 에너지가 있습니다',
    'tips.tip3.title': '여러 번 생성',
    'tips.tip3.desc': '우리 알고리즘은 매번 다른 조합을 만듭니다',
    'tips.tip4.title': '성격 고려',
    'tips.tip4.desc': '당신의 바이브와 가장 잘 맞는 그룹을 선택하세요',
    'tips.tip5.title': '즐기세요!',
    'tips.tip5.desc': '과정을 즐길 때 가장 좋은 이름이 나옵니다',
    
    // Why section
    'why.title': 'K-Pop 이름 생성기를 사용하는 이유',
    'why.lead': '우리의 고급 한국어 이름 생성기는 좋아하는 K-Pop 아이돌의 스타일에 맞는 진정성 있는 이름을 만듭니다. 팬픽션을 쓰거나, 롤플레이 캐릭터를 만들거나, 단순히 재미를 위해 사용하든, 우리 생성기는 다음을 제공합니다:',
    'why.feature1.title': '진정성 있는 한국 이름:',
    'why.feature1.desc': '실제 한국 성씨와 이름의 조합',
    'why.feature2.title': '케미 지수:',
    'why.feature2.desc': '당신과 선택한 아이돌 간의 재미있는 호환성 점수',
    'why.feature3.title': '다양한 관계 유형:',
    'why.feature3.desc': '절친, 무대 파트너, 애인 등 다양한 관계',
    'why.feature4.title': '성별별 맞춤 생성:',
    'why.feature4.desc': '선호하는 성별 스타일에 맞춘 이름',
    'why.feature5.title': '인기 K-Pop 그룹:',
    'why.feature5.desc': 'BTS, BLACKPINK, NewJeans, IVE 등 다양한 그룹 지원',
    'why.explore.title': '더 많은 이름 생성기 탐색',
    'why.explore.lead': '다양한 K-Pop 그룹을 위한 전문 생성기를 시도해보세요:',
    
    // About section
    'about.title': 'K-Pop 이름 케미에 대해',
    'about.lead': 'K-Pop 이름은 종종 특정 패턴과 문화적 의미를 따릅니다. 우리 생성기는 이러한 뉘앙스를 이해합니다:',
    'about.point1.title': '한국 명명 전통:',
    'about.point1.desc': '김, 이, 박과 같은 성씨가 가장 일반적입니다',
    'about.point2.title': '무대명 패턴:',
    'about.point2.desc': '많은 아이돌들이 자신의 성격을 반영하는 무대명을 사용합니다',
    'about.point3.title': '문화적 의미:',
    'about.point3.desc': '한국 이름은 종종 자연, 덕목, 포부와 관련된 아름다운 의미를 가집니다',
    'about.point4.title': '그룹 케미:',
    'about.point4.desc': 'K-Pop 그룹에서 잘 어울리는 이름들은 종종 비슷한 소리나 의미를 공유합니다',
    'about.point5.title': '국제적 매력:',
    'about.point5.desc': '현대 K-Pop 이름은 한국 전통과 글로벌 매력을 조화시킵니다',

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
    'share.instagram': '인스타그램',
    'share.tiktok': '틱톡',
    'share.twitter': 'X (트위터)',
    'share.snapchat': '스냅챗',
    'share.facebook': '페이스북',
    'share.discord': '디스코드',
    'share.whatsapp': '왓츠앱',
    'share.telegram': '텔레그램',
    'share.pinterest': '핀터레스트',
    'share.reddit': '레딧',
    'share.copy': '텍스트 복사',
    'share.copied': '클립보드에 복사했어요!',
    'share.error': '공유에 실패했어요. 다시 시도해 주세요.',
    'share.cta': '여기에서 직접 해보세요!',
    'share.hint': '💡 소셜미디어 바이오나 K-Pop 팬 콘텐츠에 완벽해요!',

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

// Browser language detection
function detectBrowserLanguage() {
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('en')) return 'en';
  }
  return 'en'; // default fallback
}

let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || detectBrowserLanguage();

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
  updateMetaTags();
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
}

function updateMetaTags(){
  const isKorean = currentLang === 'ko';
  
  // Update title
  const titleEl = document.querySelector('title');
  if(titleEl) {
    titleEl.textContent = isKorean ? 'KPOP 아이돌 케미 이름 생성기' : 'KPOP Idol Chemistry Name Generator';
  }
  
  // Update meta description
  const descEl = document.querySelector('meta[name="description"]');
  if(descEl) {
    descEl.setAttribute('content', isKorean 
      ? '좋아하는 K-Pop 아이돌과 어울리는 완벽한 케미 이름을 만들어보세요! BTS, BLACKPINK, NewJeans, IVE 등과 함께 한국식 이름을 생성하고 케미 지수를 확인하세요.'
      : 'Create perfect chemistry names with your favorite K-Pop idols! Generate Korean-style names with BTS, BLACKPINK, NewJeans, IVE, and more. Get chemistry scores and relationship-based names instantly.'
    );
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if(ogTitle) {
    ogTitle.setAttribute('content', isKorean ? 'KPOP 아이돌 케미 이름 생성기' : 'KPOP Idol Chemistry Name Generator');
  }
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if(ogDesc) {
    ogDesc.setAttribute('content', isKorean 
      ? '좋아하는 K-Pop 아이돌과 어울리는 완벽한 케미 이름을 만들어보세요! BTS, BLACKPINK, NewJeans, IVE 등과 함께 한국식 이름을 생성하세요.'
      : 'Create perfect chemistry names with your favorite K-Pop idols! Generate Korean-style names with BTS, BLACKPINK, NewJeans, IVE, and more.'
    );
  }
  
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if(ogLocale) {
    ogLocale.setAttribute('content', isKorean ? 'ko_KR' : 'en_US');
  }
  
  // Update Twitter tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if(twitterTitle) {
    twitterTitle.setAttribute('content', isKorean ? 'KPOP 아이돌 케미 이름 생성기' : 'KPOP Idol Chemistry Name Generator');
  }
  
  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if(twitterDesc) {
    twitterDesc.setAttribute('content', isKorean 
      ? '좋아하는 K-Pop 아이돌과 어울리는 완벽한 케미 이름을 만들어보세요! 케미 지수와 관계 기반 이름을 즉시 확인하세요.'
      : 'Create perfect chemistry names with your favorite K-Pop idols! Get chemistry scores and relationship-based names instantly.'
    );
  }
}

function initLang(){
  // Default to English unless user has stored preference
  document.documentElement.setAttribute('lang', currentLang);
  setAttrTranslations();
  updateMetaTags();

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
