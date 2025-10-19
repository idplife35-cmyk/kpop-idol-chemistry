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
    'faq.a1.p1': 'Our generator creates two unique Korean names for you:',
    'faq.a1.li1': 'Same-name: Combines a Korean surname with your chosen idol\'s name (like Kim Jungkook)',
    'faq.a1.li2': 'Styled-name: Creates a completely new name that matches your relationship type and gender preference',
    'faq.a1.p2': 'The same inputs will always give you the same results, so you can save your favorite combinations!',
    'faq.q2': 'What is the chemistry score?',
    'faq.a2.p1': 'A fun, seeded score between 70–100 based on your inputs. It\'s not a real compatibility measure.',
    'faq.q3': 'How does the Gender option work?',
    'faq.a3.p1': 'Choose the gender style that best fits your vision:',
    'faq.a3.li1': 'Male: Creates more masculine-sounding Korean names',
    'faq.a3.li2': 'Female: Generates more feminine-sounding Korean names',
    'faq.a3.li3': 'Auto: Automatically detects the best style based on your name and chosen idol',
    'faq.q4': "How do I search idols? What’s included?",
    'faq.a4.p1': 'Simply type the idol\'s name in Korean or English! Our smart search will help you find the perfect match.',
    'faq.a4.p2': 'We include popular K-Pop groups like BTS, BLACKPINK, NewJeans, IVE, and more. Don\'t worry about spelling - our search is forgiving!',
    'faq.q5': 'Privacy: is anything stored or sent?',
    'faq.a5.p1': 'Everything runs in your browser. We don\'t upload your inputs to a server.',
    'faq.a5.li1': 'Only your language preference is saved in localStorage.',
    'faq.q6': 'Why show both Korean and English names?',
    'faq.a6.p1': 'This site supports international users. English names are romanized using a simplified mapping.',
    'faq.q7': 'Can I use this offline? Any requirements?',
    'faq.a7.p1': 'Yes! Once the page loads, everything works in your browser. No internet connection needed after the initial load.',
    'faq.a7.p2': 'Just make sure you\'re using a modern browser like Chrome, Firefox, Safari, or Edge for the best experience.',
    'faq.q8': 'How do I change language?',
    'faq.a8.p1': 'Use the language selector at the top-right. The page updates instantly and remembers your choice.',
    'faq.q9': 'What are the characteristics of K-Pop idol names?',
    'faq.a9.p1': 'K-Pop idol names often feature:',
    'faq.a9.li1': 'Unique sounds: Names that are easy to pronounce and remember',
    'faq.a9.li2': 'Cultural significance: Often reflect Korean traditions and meanings',
    'faq.a9.li3': 'Stage presence: Designed to sound powerful and memorable on stage',
    'faq.a9.li4': 'International appeal: Easy for global fans to pronounce and remember',
    'faq.q10': 'What\'s the difference between Korean and Western names?',
    'faq.a10.p1': 'Key differences include:',
    'faq.a10.li1': 'Structure: Korean names typically have 2-3 syllables (surname + given name)',
    'faq.a10.li2': 'Meaning: Korean names often have specific meanings related to nature, virtues, or aspirations',
    'faq.a10.li3': 'Pronunciation: Korean names follow specific phonetic rules and patterns',
    'faq.a10.li4': 'Cultural context: Names reflect Korean cultural values and traditions',
    'faq.q11': 'How is the chemistry score calculated?',
    'faq.a11.p1': 'The chemistry score is a fun, algorithm-based calculation that considers:',
    'faq.a11.li1': 'Name compatibility: How well your name sounds with the idol\'s name',
    'faq.a11.li2': 'Relationship type: Different relationship types have different scoring weights',
    'faq.a11.li3': 'Gender preferences: Male/female preferences affect the scoring algorithm',
    'faq.a11.li4': 'Random seed: A seeded random factor ensures consistent results for the same inputs',
    'faq.a11.p2': 'Remember: This is for entertainment purposes only and not a real compatibility measure!',
    'faq.q12': 'Will more K-Pop groups be added in the future?',
    'faq.a12.p1': 'Yes! We\'re constantly working to add more popular K-Pop groups to our generator.',
    'faq.a12.p2': 'Currently supported groups include BTS, BLACKPINK, NewJeans, IVE, HUNTR/X, and SajaBoys. We\'re planning to add more groups based on user requests and popularity.',
    'faq.a12.p3': 'Have a specific group you\'d like to see? Let us know through our feedback system!',
    'faq.q13': 'Can I use the generated names in real life?',
    'faq.a13.p1': 'The names generated by our tool are for entertainment and creative purposes only.',
    'faq.a13.li1': 'Fanfiction and roleplay: Perfect for creative writing and character development',
    'faq.a13.li2': 'Social media: Great for usernames, bios, and creative content',
    'faq.a13.li3': 'Gaming: Ideal for character names in games and virtual worlds',
    'faq.a13.li4': 'Legal considerations: Please respect intellectual property and don\'t use names that might infringe on existing trademarks',
    'faq.q14': 'What\'s the difference between real names and stage names?',
    'faq.a14.p1': 'K-Pop idols often have both real names and stage names:',
    'faq.a14.li1': 'Real names: Their actual Korean names used in daily life',
    'faq.a14.li2': 'Stage names: Performance names chosen for their sound, meaning, or memorability',
    'faq.a14.li3': 'Our generator creates names that could work as either real names or stage names',
    'faq.a14.p2': 'Some idols use their real names, while others prefer stage names for their career.',
    'faq.q15': 'How do Korean names work with different groups?',
    'faq.a15.p1': 'Each K-Pop group has its own naming style and energy:',
    'faq.a15.li1': 'BTS: Hip-hop and R&B influenced names with strong, memorable sounds',
    'faq.a15.li2': 'BLACKPINK: Bold, unique names that stand out and sound powerful',
    'faq.a15.li3': 'NewJeans: Trendy, modern names that feel fresh and contemporary',
    'faq.a15.li4': 'IVE: Elegant, sophisticated names with a refined feel',
    'faq.a15.p2': 'Our generator adapts to each group\'s style to create authentic-sounding names.',
    'faq.q16': 'Can I use these names for my social media?',
    'faq.a16.p1': 'Absolutely! These names are perfect for:',
    'faq.a16.li1': 'Social media usernames and display names',
    'faq.a16.li2': 'Fan accounts and K-Pop content creation',
    'faq.a16.li3': 'Gaming character names and online personas',
    'faq.a16.li4': 'Creative writing and fanfiction',
    'faq.a16.p2': 'Just remember to be respectful and not impersonate real idols.',
    'faq.q17': 'What makes a good K-Pop name?',
    'faq.a17.p1': 'Great K-Pop names typically have:',
    'faq.a17.li1': 'Easy pronunciation for international fans',
    'faq.a17.li2': 'Memorable and catchy sounds',
    'faq.a17.li3': 'Cultural significance or beautiful meanings',
    'faq.a17.li4': 'Stage presence and performance appeal',
    'faq.a17.p2': 'Our generator considers all these factors when creating names.',
    'faq.q18': 'How accurate are the Korean pronunciations?',
    'faq.a18.p1': 'Our romanization follows standard Korean pronunciation rules:',
    'faq.a18.li1': 'Based on Revised Romanization of Korean (RR) system',
    'faq.a18.li2': 'Designed to be accessible for English speakers',
    'faq.a18.li3': 'May differ slightly from how names appear in official materials',
    'faq.a18.p2': 'For the most accurate pronunciation, we recommend learning basic Korean phonetics.',
    'faq.q19': 'Can I request specific idols or groups to be added?',
    'faq.a19.p1': 'Yes! We\'re always looking to expand our database:',
    'faq.a19.li1': 'Send us feedback through our contact system',
    'faq.a19.li2': 'Popular requests get priority for new additions',
    'faq.a19.li3': 'We regularly update with new debuts and popular groups',
    'faq.a19.p2': 'Your suggestions help us make the generator better for everyone!',
    'faq.q20': 'Is this generator suitable for all ages?',
    'faq.a20.p1': 'Yes! Our name generator is designed to be:',
    'faq.a20.li1': 'Family-friendly and appropriate for all ages',
    'faq.a20.li2': 'Educational about Korean culture and naming traditions',
    'faq.a20.li3': 'Fun and engaging for K-Pop fans of any age',
    'faq.a20.li4': 'Safe for use in schools and educational settings',
    'faq.a20.p2': 'We focus on positive, creative name generation without any inappropriate content.',
    'footer.noscript': 'JavaScript is required to use this page.',

    // Guide Section
    'guide.title': 'How to Use the Name Generator',
    'guide.subtitle': 'Follow our step-by-step guide to create your perfect K-Pop chemistry name',
    'guide.step1.title': 'Enter Your Name',
    'guide.step1.desc': 'Type your real name in the input field. This will be used as the base for generating your Korean name.',
    'guide.step1.example': 'Example: "Sophia" → "소피아"',
    'guide.step1.tips.title': 'Tips:',
    'guide.step1.tip1': 'Use your full name or nickname',
    'guide.step1.tip2': 'Names with 2-4 syllables work best',
    'guide.step1.tip3': 'Special characters are automatically converted',
    'guide.step2.title': 'Choose Your Favorite Idol',
    'guide.step2.desc': 'Search and select your favorite K-Pop idol from our database. You can type in Korean or English!',
    'guide.step2.example': 'Popular choices: 정국 (Jungkook), 제니 (Jennie), 민지 (Minji), 유진 (Yujin)',
    'guide.step2.tips.title': 'Tips:',
    'guide.step2.tip1': 'Our search is forgiving - try different spellings',
    'guide.step2.tip2': 'You can search by group name too',
    'guide.step2.tip3': 'New idols are added regularly',
    'guide.step3.title': 'Select Your Gender Preference',
    'guide.step3.desc': 'Choose how you want your generated name to sound - masculine, feminine, or let us decide automatically.',
    'guide.step3.example': 'Options:',
    'guide.step3.option1': 'Male: 강한, 카리스마 있는 이름',
    'guide.step3.option2': 'Female: 우아하고 아름다운 이름',
    'guide.step3.option3': 'Auto: 자동으로 최적의 스타일 선택',
    'guide.step3.tips.title': 'Tips:',
    'guide.step3.tip1': 'Auto mode considers your name and chosen idol',
    'guide.step3.tip2': 'You can always regenerate with different settings',
    'guide.step3.tip3': 'Gender affects syllable patterns and meanings',
    'guide.step4.title': 'Choose Your Relationship Type',
    'guide.step4.desc': 'Select what kind of relationship you want to have with your chosen idol. This affects the name style and chemistry score.',
    'guide.step4.example': 'Relationship types:',
    'guide.step4.option1': '절친 (Best Friend): 친근하고 편안한 이름',
    'guide.step4.option2': '무대 파트너 (Stage Partner): 강렬하고 기억에 남는 이름',
    'guide.step4.option3': '같은 반 친구 (Classmate): 귀엽고 친숙한 이름',
    'guide.step4.option4': '드라마 주인공 (Drama Lead): 로맨틱하고 우아한 이름',
    'guide.step4.option5': '애인 (Lover): 달콤하고 특별한 이름',
    'guide.step4.tips.title': 'Tips:',
    'guide.step4.tip1': 'Each relationship type has unique naming patterns',
    'guide.step4.tip2': 'Chemistry scores vary by relationship compatibility',
    'guide.step4.tip3': 'Try different relationships for variety',
    'guide.step5.title': 'Generate & Share Your Name',
    'guide.step5.desc': 'Click the generate button to create your unique K-Pop chemistry name! You\'ll get two names and a chemistry score.',
    'guide.step5.example': 'Example Result:',
    'guide.step5.result1': 'Same Name: 김정국 (Kim Jungkook)',
    'guide.step5.result2': 'Styled Name: 한소영 (Han Soyoung)',
    'guide.step5.result3': 'Chemistry: 87%',
    'guide.step5.tips.title': 'Tips:',
    'guide.step5.tip1': 'Save your favorite names to favorites',
    'guide.step5.tip2': 'Share on social media with friends',
    'guide.step5.tip3': 'Try different combinations for more options',
    'guide.step5.tip4': 'Check your history for previous results',
    'guide.advanced.title': 'Advanced Tips & Tricks',
    'guide.advanced.results.title': 'Getting Better Results',
    'guide.advanced.results.tip1': 'Experiment with combinations: Try different idols and relationships',
    'guide.advanced.results.tip2': 'Use the history feature: Keep track of your favorite combinations',
    'guide.advanced.results.tip3': 'Save to favorites: Don\'t lose your perfect name',
    'guide.advanced.results.tip4': 'Try different spellings: Our search is flexible',
    'guide.advanced.troubleshooting.title': 'Troubleshooting',
    'guide.advanced.troubleshooting.tip1': 'Name not found? Try searching in Korean or English',
    'guide.advanced.troubleshooting.tip2': 'Low chemistry score? Try different relationship types',
    'guide.advanced.troubleshooting.tip3': 'Don\'t like the result? Click regenerate for new options',
    'guide.advanced.troubleshooting.tip4': 'Mobile issues? Make sure you\'re using a modern browser',

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
    'page.seventeen.h1': '💎✨ SEVENTEEN Name Generator 🎵',
    'page.seventeen.lead': 'Create an adorable Korean-style name that matches with SEVENTEEN members.',
    'page.straykids.h1': '🔥⚡ Stray Kids Name Generator 🎤',
    'page.straykids.lead': 'Create an energetic Korean-style name that matches with Stray Kids members.',
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

    // New long-tail pages (teen-friendly copy)
    'section.why': 'Why you’ll love this',
    'section.how': 'How it works',
    'page.ship.h1': '💞 K‑Pop Ship Name Generator ✨',
    'page.ship.lead': 'Make cute OTP names for your fave idol pairings — perfect for fanfic & edits.',
    'page.stage.h1': '🎤 K‑Pop Stage Name Generator ✨',
    'page.stage.lead': 'Powerful, stage‑ready names with idol energy.',
    'page.nickname.h1': '👑 K‑Pop Nickname Generator ✨',
    'page.nickname.lead': 'Short, cute or aesthetic nicknames for socials and games.',
    'page.aesthetic.h1': '🌸 K‑Pop Aesthetic Name Generator ✨',
    'page.aesthetic.lead': 'Soft, dark and dreamy vibes for your display name.',
    'page.cute.h1': '💗 K‑Pop Cute Name Generator ✨',
    'page.cute.lead': 'Sweet, adorable names with soft vibes.',
    'page.badass.h1': '🖤 K‑Pop Badass Name Generator ✨',
    'page.badass.lead': 'Dark, powerful names with main‑character energy.',
    'page.username.h1': '👤 K‑Pop Username Generator ✨',
    'page.username.lead': 'Unique handles for TikTok, Instagram and X.',
    'page.bio.h1': '#️⃣ K‑Pop Bio & Hashtag Generator ✨',
    'page.bio.lead': 'Viral‑ready bios and hashtag bundles for your posts.',
    'page.romanized.h1': '🔤 Korean Romanized Name Generator ✨',
    'page.romanized.lead': 'Turn Hangul names into clean, readable English.',
    'page.combiner.h1': '🔗 K‑Pop Couple Name Combiner ✨',
    'page.combiner.lead': 'Mash two idol names into a single ship name.',
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
    'faq.a1.p1': '우리 생성기는 두 가지 독특한 한국 이름을 만들어줍니다:',
    'faq.a1.li1': '같은 이름: 한국 성씨와 선택한 아이돌의 이름을 결합 (예: 김정국)',
    'faq.a1.li2': '스타일 이름: 관계 유형과 성별 선호도에 맞는 완전히 새로운 이름 생성',
    'faq.a1.p2': '같은 입력값은 항상 같은 결과를 제공하므로 좋아하는 조합을 저장할 수 있습니다!',
    'faq.q2': '케미 지수는 무엇인가요?',
    'faq.a2.p1': '입력값을 바탕으로 한 재미있는 70-100점 사이의 시드 점수입니다. 실제 호환성 측정이 아닙니다.',
    'faq.q3': '성별 옵션은 어떻게 동작하나요?',
    'faq.a3.p1': '당신의 비전에 가장 잘 맞는 성별 스타일을 선택하세요:',
    'faq.a3.li1': '남성: 더 남성적인 한국 이름을 생성',
    'faq.a3.li2': '여성: 더 여성적인 한국 이름을 생성',
    'faq.a3.li3': '자동: 이름과 선택한 아이돌을 바탕으로 최적의 스타일을 자동 감지',
    'faq.q4': '아이돌 검색은 어떻게 하나요? 수록 범위는?',
    'faq.a4.p1': '아이돌의 이름을 한국어나 영어로 입력하기만 하면 됩니다! 스마트 검색이 완벽한 매치를 찾아드립니다.',
    'faq.a4.p2': 'BTS, BLACKPINK, NewJeans, IVE 등 인기 K-Pop 그룹을 포함합니다. 철자 걱정은 하지 마세요 - 우리 검색은 관대합니다!',
    'faq.q5': '개인정보는 저장되거나 전송되나요?',
    'faq.a5.p1': '모든 것이 브라우저에서 실행됩니다. 입력값을 서버에 업로드하지 않습니다.',
    'faq.a5.li1': '언어 설정만 localStorage에 저장됩니다.',
    'faq.q6': '한글/영문 표기를 모두 보여주는 이유는?',
    'faq.a6.p1': '이 사이트는 국제 사용자를 지원합니다. 영어 이름은 간단한 매핑을 사용하여 로마자로 표기됩니다.',
    'faq.q7': '오프라인 사용 가능? 실행 조건은?',
    'faq.a7.p1': '네! 페이지가 로드되면 모든 것이 브라우저에서 작동합니다. 초기 로드 후에는 인터넷 연결이 필요하지 않습니다.',
    'faq.a7.p2': '최상의 경험을 위해 Chrome, Firefox, Safari, Edge 같은 최신 브라우저를 사용하세요.',
    'faq.q8': '언어는 어디서 바꾸나요?',
    'faq.a8.p1': '오른쪽 상단의 언어 선택기를 사용하세요. 페이지가 즉시 업데이트되고 선택을 기억합니다.',
    'faq.q9': 'K-Pop 아이돌 이름의 특징은 무엇인가요?',
    'faq.a9.p1': 'K-Pop 아이돌 이름은 종종 다음과 같은 특징을 가집니다:',
    'faq.a9.li1': '독특한 소리: 발음하기 쉽고 기억하기 쉬운 이름',
    'faq.a9.li2': '문화적 의미: 한국 전통과 의미를 반영',
    'faq.a9.li3': '무대 존재감: 무대에서 강력하고 기억에 남도록 설계',
    'faq.a9.li4': '국제적 매력: 전 세계 팬들이 발음하고 기억하기 쉬움',
    'faq.q10': '한국 이름과 서양 이름의 차이점은 무엇인가요?',
    'faq.a10.p1': '주요 차이점은 다음과 같습니다:',
    'faq.a10.li1': '구조: 한국 이름은 보통 2-3음절 (성씨 + 이름)',
    'faq.a10.li2': '의미: 한국 이름은 종종 자연, 덕목, 포부와 관련된 특정 의미를 가짐',
    'faq.a10.li3': '발음: 한국 이름은 특정 음성학적 규칙과 패턴을 따름',
    'faq.a10.li4': '문화적 맥락: 이름은 한국 문화적 가치와 전통을 반영',
    'faq.q11': '케미 점수는 어떻게 계산되나요?',
    'faq.a11.p1': '케미 점수는 다음을 고려한 재미있는 알고리즘 기반 계산입니다:',
    'faq.a11.li1': '이름 호환성: 당신의 이름이 아이돌 이름과 얼마나 잘 어울리는지',
    'faq.a11.li2': '관계 유형: 다른 관계 유형은 다른 점수 가중치를 가짐',
    'faq.a11.li3': '성별 선호도: 남성/여성 선호도가 점수 알고리즘에 영향을 미침',
    'faq.a11.li4': '랜덤 시드: 시드된 랜덤 요소로 같은 입력에 대해 일관된 결과 보장',
    'faq.a11.p2': '기억하세요: 이것은 오락 목적일 뿐 실제 호환성 측정이 아닙니다!',
    'faq.q12': '앞으로 더 많은 K-Pop 그룹이 추가될 예정인가요?',
    'faq.a12.p1': '네! 우리는 지속적으로 더 많은 인기 K-Pop 그룹을 생성기에 추가하고 있습니다.',
    'faq.a12.p2': '현재 지원되는 그룹은 BTS, BLACKPINK, NewJeans, IVE, HUNTR/X, SajaBoys입니다. 사용자 요청과 인기도를 바탕으로 더 많은 그룹을 추가할 계획입니다.',
    'faq.a12.p3': '특정 그룹을 보고 싶으시다면 피드백 시스템을 통해 알려주세요!',
    'faq.q13': '생성된 이름을 실제로 사용해도 되나요?',
    'faq.a13.p1': '우리 도구로 생성된 이름은 오락 및 창작 목적으로만 사용하세요.',
    'faq.a13.li1': '팬픽션과 롤플레이: 창작 글쓰기와 캐릭터 개발에 완벽',
    'faq.a13.li2': '소셜 미디어: 사용자명, 바이오, 창작 콘텐츠에 훌륭함',
    'faq.a13.li3': '게임: 게임과 가상 세계의 캐릭터 이름에 이상적',
    'faq.a13.li4': '법적 고려사항: 지적 재산을 존중하고 기존 상표권을 침해할 수 있는 이름은 사용하지 마세요',
    'faq.q14': '실제 이름과 무대명의 차이점은 무엇인가요?',
    'faq.a14.p1': 'K-Pop 아이돌들은 종종 실제 이름과 무대명을 모두 가집니다:',
    'faq.a14.li1': '실제 이름: 일상생활에서 사용하는 실제 한국 이름',
    'faq.a14.li2': '무대명: 소리, 의미, 기억하기 쉬움을 위해 선택한 공연용 이름',
    'faq.a14.li3': '우리 생성기는 실제 이름이나 무대명으로 모두 사용할 수 있는 이름을 만듭니다',
    'faq.a14.p2': '일부 아이돌은 실제 이름을 사용하고, 다른 아이돌들은 경력을 위해 무대명을 선호합니다.',
    'faq.q15': '한국 이름이 다른 그룹과 어떻게 작동하나요?',
    'faq.a15.p1': '각 K-Pop 그룹은 고유한 네이밍 스타일과 에너지를 가집니다:',
    'faq.a15.li1': 'BTS: 힙합과 R&B에 영향을 받은 강하고 기억에 남는 소리의 이름',
    'faq.a15.li2': 'BLACKPINK: 눈에 띄고 강력하게 들리는 대담하고 독특한 이름',
    'faq.a15.li3': 'NewJeans: 신선하고 현대적으로 느껴지는 트렌디하고 모던한 이름',
    'faq.a15.li4': 'IVE: 세련된 느낌의 우아하고 정교한 이름',
    'faq.a15.p2': '우리 생성기는 진정성 있는 이름을 만들기 위해 각 그룹의 스타일에 맞춰 조정됩니다.',
    'faq.q16': '이 이름들을 소셜 미디어에 사용할 수 있나요?',
    'faq.a16.p1': '물론입니다! 이 이름들은 다음에 완벽합니다:',
    'faq.a16.li1': '소셜 미디어 사용자명과 표시명',
    'faq.a16.li2': '팬 계정과 K-Pop 콘텐츠 제작',
    'faq.a16.li3': '게임 캐릭터 이름과 온라인 페르소나',
    'faq.a16.li4': '창작 글쓰기와 팬픽션',
    'faq.a16.p2': '실제 아이돌을 사칭하지 않고 존중하는 것을 기억하세요.',
    'faq.q17': '좋은 K-Pop 이름의 특징은 무엇인가요?',
    'faq.a17.p1': '훌륭한 K-Pop 이름은 일반적으로 다음을 가집니다:',
    'faq.a17.li1': '국제 팬들이 발음하기 쉬운 이름',
    'faq.a17.li2': '기억하기 쉽고 매력적인 소리',
    'faq.a17.li3': '문화적 의미나 아름다운 의미',
    'faq.a17.li4': '무대 존재감과 공연 매력',
    'faq.a17.p2': '우리 생성기는 이름을 만들 때 이러한 모든 요소를 고려합니다.',
    'faq.q18': '한국어 발음은 얼마나 정확한가요?',
    'faq.a18.p1': '우리의 로마자 표기는 표준 한국어 발음 규칙을 따릅니다:',
    'faq.a18.li1': '한국어 로마자 표기법(개정) 시스템 기반',
    'faq.a18.li2': '영어 사용자가 접근하기 쉽도록 설계',
    'faq.a18.li3': '공식 자료에 나타나는 방식과 약간 다를 수 있음',
    'faq.a18.p2': '가장 정확한 발음을 위해서는 기본 한국어 음성학을 배우는 것을 권장합니다.',
    'faq.q19': '특정 아이돌이나 그룹 추가를 요청할 수 있나요?',
    'faq.a19.p1': '네! 우리는 항상 데이터베이스를 확장하려고 합니다:',
    'faq.a19.li1': '연락 시스템을 통해 피드백을 보내주세요',
    'faq.a19.li2': '인기 있는 요청은 새로운 추가에 우선순위를 가집니다',
    'faq.a19.li3': '새로운 데뷔와 인기 그룹으로 정기적으로 업데이트합니다',
    'faq.a19.p2': '당신의 제안은 모든 사람을 위해 생성기를 더 좋게 만드는 데 도움이 됩니다!',
    'faq.q20': '이 생성기는 모든 연령에 적합한가요?',
    'faq.a20.p1': '네! 우리 이름 생성기는 다음과 같이 설계되었습니다:',
    'faq.a20.li1': '가족 친화적이고 모든 연령에 적합',
    'faq.a20.li2': '한국 문화와 명명 전통에 대한 교육적',
    'faq.a20.li3': '모든 연령의 K-Pop 팬들에게 재미있고 매력적',
    'faq.a20.li4': '학교와 교육 환경에서 사용하기 안전',
    'faq.a20.p2': '우리는 부적절한 콘텐츠 없이 긍정적이고 창의적인 이름 생성에 집중합니다.',
    'footer.noscript': '이 페이지를 사용하려면 JavaScript가 필요합니다.',

    // Guide Section - Korean
    'guide.title': '이름 생성기 사용법',
    'guide.subtitle': '완벽한 K-Pop 케미 이름을 만들기 위한 단계별 가이드를 따라해보세요',
    'guide.step1.title': '이름 입력하기',
    'guide.step1.desc': '입력 필드에 실제 이름을 입력하세요. 이것이 한국 이름 생성의 기반이 됩니다.',
    'guide.step1.example': '예시: "Sophia" → "소피아"',
    'guide.step1.tips.title': '팁:',
    'guide.step1.tip1': '전체 이름이나 별명을 사용하세요',
    'guide.step1.tip2': '2-4음절 이름이 가장 좋습니다',
    'guide.step1.tip3': '특수문자는 자동으로 변환됩니다',
    'guide.step2.title': '좋아하는 아이돌 선택하기',
    'guide.step2.desc': '데이터베이스에서 좋아하는 K-Pop 아이돌을 검색하고 선택하세요. 한국어나 영어로 입력할 수 있습니다!',
    'guide.step2.example': '인기 선택: 정국 (Jungkook), 제니 (Jennie), 민지 (Minji), 유진 (Yujin)',
    'guide.step2.tips.title': '팁:',
    'guide.step2.tip1': '우리 검색은 관대합니다 - 다른 철자를 시도해보세요',
    'guide.step2.tip2': '그룹 이름으로도 검색할 수 있습니다',
    'guide.step2.tip3': '새로운 아이돌이 정기적으로 추가됩니다',
    'guide.step3.title': '성별 선호도 선택하기',
    'guide.step3.desc': '생성된 이름이 어떻게 들리기를 원하는지 선택하세요 - 남성적, 여성적, 또는 자동으로 결정하게 하세요.',
    'guide.step3.example': '옵션:',
    'guide.step3.option1': '남성: 강한, 카리스마 있는 이름',
    'guide.step3.option2': '여성: 우아하고 아름다운 이름',
    'guide.step3.option3': '자동: 자동으로 최적의 스타일 선택',
    'guide.step3.tips.title': '팁:',
    'guide.step3.tip1': '자동 모드는 이름과 선택한 아이돌을 고려합니다',
    'guide.step3.tip2': '언제든지 다른 설정으로 재생성할 수 있습니다',
    'guide.step3.tip3': '성별은 음절 패턴과 의미에 영향을 줍니다',
    'guide.step4.title': '관계 유형 선택하기',
    'guide.step4.desc': '선택한 아이돌과 어떤 종류의 관계를 원하는지 선택하세요. 이것은 이름 스타일과 케미 점수에 영향을 줍니다.',
    'guide.step4.example': '관계 유형:',
    'guide.step4.option1': '절친 (Best Friend): 친근하고 편안한 이름',
    'guide.step4.option2': '무대 파트너 (Stage Partner): 강렬하고 기억에 남는 이름',
    'guide.step4.option3': '같은 반 친구 (Classmate): 귀엽고 친숙한 이름',
    'guide.step4.option4': '드라마 주인공 (Drama Lead): 로맨틱하고 우아한 이름',
    'guide.step4.option5': '애인 (Lover): 달콤하고 특별한 이름',
    'guide.step4.tips.title': '팁:',
    'guide.step4.tip1': '각 관계 유형은 고유한 명명 패턴을 가집니다',
    'guide.step4.tip2': '케미 점수는 관계 호환성에 따라 달라집니다',
    'guide.step4.tip3': '다양성을 위해 다른 관계를 시도해보세요',
    'guide.step5.title': '이름 생성 및 공유하기',
    'guide.step5.desc': '생성 버튼을 클릭하여 고유한 K-Pop 케미 이름을 만드세요! 두 개의 이름과 케미 점수를 얻을 수 있습니다.',
    'guide.step5.example': '결과 예시:',
    'guide.step5.result1': '같은 이름: 김정국 (Kim Jungkook)',
    'guide.step5.result2': '스타일 이름: 한소영 (Han Soyoung)',
    'guide.step5.result3': '케미: 87%',
    'guide.step5.tips.title': '팁:',
    'guide.step5.tip1': '좋아하는 이름을 즐겨찾기에 저장하세요',
    'guide.step5.tip2': '친구들과 소셜 미디어에 공유하세요',
    'guide.step5.tip3': '더 많은 옵션을 위해 다른 조합을 시도해보세요',
    'guide.step5.tip4': '이전 결과를 위해 히스토리를 확인하세요',
    'guide.advanced.title': '고급 팁 & 트릭',
    'guide.advanced.results.title': '더 나은 결과 얻기',
    'guide.advanced.results.tip1': '조합 실험: 다른 아이돌과 관계를 시도해보세요',
    'guide.advanced.results.tip2': '히스토리 기능 사용: 좋아하는 조합을 추적하세요',
    'guide.advanced.results.tip3': '즐겨찾기에 저장: 완벽한 이름을 잃지 마세요',
    'guide.advanced.results.tip4': '다른 철자 시도: 우리 검색은 유연합니다',
    'guide.advanced.troubleshooting.title': '문제 해결',
    'guide.advanced.troubleshooting.tip1': '이름을 찾을 수 없나요? 한국어나 영어로 검색해보세요',
    'guide.advanced.troubleshooting.tip2': '케미 점수가 낮나요? 다른 관계 유형을 시도해보세요',
    'guide.advanced.troubleshooting.tip3': '결과가 마음에 들지 않나요? 새로운 옵션을 위해 재생성을 클릭하세요',
    'guide.advanced.troubleshooting.tip4': '모바일 문제? 최신 브라우저를 사용하고 있는지 확인하세요',

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
    'page.seventeen.h1': '💎✨ SEVENTEEN 전용 이름 생성기 🎵',
    'page.seventeen.lead': 'SEVENTEEN 멤버와 잘 어울리는 한국식 이름을 만들어 보세요.',
    'page.straykids.h1': '🔥⚡ 스트레이키즈 전용 이름 생성기 🎤',
    'page.straykids.lead': '스트레이키즈 멤버와 잘 어울리는 한국식 이름을 만들어 보세요.',
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

    // New long-tail pages (teen-friendly copy)
    'section.why': '왜 좋아하나요',
    'section.how': '사용 방법',
    'page.ship.h1': '💞 K‑Pop 커플/쉽 이름 생성기 ✨',
    'page.ship.lead': '최애 페어링을 위한 귀엽고 기억나는 OTP 이름을 만들어보세요. 팬픽/편집에 딱!',
    'page.stage.h1': '🎤 K‑Pop 무대명 생성기 ✨',
    'page.stage.lead': '무대에서 빛나는 파워풀한 아이돌식 무대명.',
    'page.nickname.h1': '👑 K‑Pop 닉네임 생성기 ✨',
    'page.nickname.lead': 'SNS/게임에 잘 맞는 짧고 귀엽거나 미학적인 닉네임.',
    'page.aesthetic.h1': '🌸 K‑Pop 에스테틱 이름 생성기 ✨',
    'page.aesthetic.lead': '소프트/다크/드리미 무드로 예쁜 표시명을 만들어보세요.',
    'page.cute.h1': '💗 K‑Pop 큐트 이름 생성기 ✨',
    'page.cute.lead': '부드럽고 사랑스러운 바이브의 귀여운 이름.',
    'page.badass.h1': '🖤 K‑Pop 배드애스 이름 생성기 ✨',
    'page.badass.lead': '다크하고 임팩트 있는 MCE(Main Character Energy) 네이밍.',
    'page.username.h1': '👤 K‑Pop 유저네임 생성기 ✨',
    'page.username.lead': '틱톡/인스타/X에서 눈에 띄는 핸들 아이디어.',
    'page.bio.h1': '#️⃣ K‑Pop 바이오 & 해시태그 생성기 ✨',
    'page.bio.lead': '바이럴을 겨냥한 바이오 문구와 해시태그 번들.',
    'page.romanized.h1': '🔤 한국어 로마자 이름 생성기 ✨',
    'page.romanized.lead': '한글 이름을 깔끔하고 읽기 쉬운 영어 표기로 변환.',
    'page.combiner.h1': '🔗 K‑Pop 커플 이름 결합기 ✨',
    'page.combiner.lead': '두 이름을 하나의 쉽/커플 네임으로 합쳐보세요.',
  }
};

// Browser language detection
function detectBrowserLanguage() {
  // Always default to English, only switch to Korean if explicitly Korean browser
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('ko')) return 'ko';
  }
  return 'en'; // default to English
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
  // Respect page-specific i18n title if provided
  if(titleEl && !titleEl.hasAttribute('data-i18n')) {
    titleEl.textContent = isKorean ? 'KPOP 아이돌 케미 이름 생성기' : 'KPOP Idol Chemistry Name Generator';
  }
  
  // Update meta description
  const descEl = document.querySelector('meta[name="description"]');
  if(descEl && descEl.hasAttribute('data-i18n')) {
    descEl.setAttribute('content', isKorean 
      ? '좋아하는 K-Pop 아이돌과 어울리는 완벽한 케미 이름을 만들어보세요! BTS, BLACKPINK, NewJeans, IVE 등과 함께 한국식 이름을 생성하고 케미 지수를 확인하세요.'
      : 'Create perfect chemistry names with your favorite K-Pop idols! Generate Korean-style names with BTS, BLACKPINK, NewJeans, IVE, and more. Get chemistry scores and relationship-based names instantly.'
    );
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if(ogTitle && ogTitle.hasAttribute('data-i18n')) {
    ogTitle.setAttribute('content', isKorean ? 'KPOP 아이돌 케미 이름 생성기' : 'KPOP Idol Chemistry Name Generator');
  }
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if(ogDesc && ogDesc.hasAttribute('data-i18n')) {
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
  if(twitterTitle && twitterTitle.hasAttribute('data-i18n')) {
    twitterTitle.setAttribute('content', isKorean ? 'KPOP 아이돌 케미 이름 생성기' : 'KPOP Idol Chemistry Name Generator');
  }
  
  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if(twitterDesc && twitterDesc.hasAttribute('data-i18n')) {
    twitterDesc.setAttribute('content', isKorean 
      ? '좋아하는 K-Pop 아이돌과 어울리는 완벽한 케미 이름을 만들어보세요! 케미 지수와 관계 기반 이름을 즉시 확인하세요.'
      : 'Create perfect chemistry names with your favorite K-Pop idols! Get chemistry scores and relationship-based names instantly.'
    );
  }
}

function initLang(){
  // Default to English unless user has stored preference or browser is Korean
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
