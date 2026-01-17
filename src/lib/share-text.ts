/**
 * Share Text Utilities
 * Generates optimized share text for different social media platforms
 */

interface ShareTextParams {
  userName: string;
  kpopNameKr: string;
  kpopNameEn: string;
  idolNameEn: string;
  idolNameKr: string;
  groupName: string;
  chemistry: number;
  chemistryTier?: string;
}

// Popular K-Pop hashtags by platform
const COMMON_HASHTAGS = {
  kpop: ['#KPop', '#케이팝'],
  nameGenerator: ['#KPopNameGenerator', '#KPopName'],
  chemistry: ['#IdolChemistry', '#KPopCompatibility'],
};

// Group-specific hashtags
const GROUP_HASHTAGS: Record<string, string[]> = {
  'BTS': ['#BTS', '#방탄소년단', '#ARMY', '#BTSArmy'],
  'BLACKPINK': ['#BLACKPINK', '#블랙핑크', '#BLINK', '#BP'],
  'Stray Kids': ['#StrayKids', '#스트레이키즈', '#SKZ', '#STAY'],
  'TWICE': ['#TWICE', '#트와이스', '#ONCE'],
  'NewJeans': ['#NewJeans', '#뉴진스', '#Bunnies'],
  'SEVENTEEN': ['#SEVENTEEN', '#세븐틴', '#SVT', '#CARAT'],
  'EXO': ['#EXO', '#엑소', '#EXOL'],
  'aespa': ['#aespa', '#에스파', '#MY'],
  'LE SSERAFIM': ['#LESSERAFIM', '#르세라핌', '#FEARNOT'],
  'IVE': ['#IVE', '#아이브', '#DIVE'],
  'ITZY': ['#ITZY', '#있지', '#MIDZY'],
  'TXT': ['#TXT', '#투모로우바이투게더', '#MOA'],
  'ENHYPEN': ['#ENHYPEN', '#엔하이픈', '#ENGENE'],
  '(G)I-DLE': ['#GIDLE', '#여자아이들', '#Neverland'],
  'Red Velvet': ['#RedVelvet', '#레드벨벳', '#ReVeluv'],
  'NCT 127': ['#NCT127', '#NCT', '#NCTzen'],
  'ATEEZ': ['#ATEEZ', '#에이티즈', '#ATINY'],
  'RIIZE': ['#RIIZE', '#라이즈', '#BRIIZE'],
  'PLAVE': ['#PLAVE', '#플레이브'],
};

// Emoji sets based on chemistry tier
const TIER_EMOJIS: Record<string, string[]> = {
  mythical: ['💎', '✨', '🌟', '👑', '🔥'],
  legendary: ['💜', '⭐', '✨', '🎯', '💫'],
  epic: ['💕', '🎵', '💖', '🌸'],
  rare: ['💗', '🎤', '💝'],
  uncommon: ['💛', '🎶'],
  common: ['💙', '🎼'],
};

/**
 * Generate share text for X (Twitter)
 */
export function generateTwitterShareText(params: ShareTextParams): string {
  const { kpopNameKr, idolNameEn, groupName, chemistry, chemistryTier } = params;
  
  const emojis = TIER_EMOJIS[chemistryTier || 'common'] || TIER_EMOJIS.common;
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  // Get group hashtags (up to 2)
  const groupTags = GROUP_HASHTAGS[groupName]?.slice(0, 2) || [`#${groupName.replace(/\s+/g, '')}`];
  
  const lines = [
    `${emoji} My chemistry with ${idolNameEn} is ${chemistry}%!`,
    `My K-Pop name: ${kpopNameKr}`,
    '',
    'Find your idol soulmate 👇',
  ];
  
  const hashtags = [
    ...groupTags,
    '#KPop',
    '#KPopNameGenerator',
  ].join(' ');
  
  return `${lines.join('\n')}\n\n${hashtags}`;
}

/**
 * Generate share text for copying (general use)
 */
export function generateCopyShareText(params: ShareTextParams): string {
  const { kpopNameKr, kpopNameEn, idolNameEn, idolNameKr, groupName, chemistry, chemistryTier } = params;
  
  const emojis = TIER_EMOJIS[chemistryTier || 'common'] || TIER_EMOJIS.common;
  
  // Get group hashtags
  const groupTags = GROUP_HASHTAGS[groupName]?.slice(0, 3) || [`#${groupName.replace(/\s+/g, '')}`];
  
  const lines = [
    `${emojis[0]} My K-Pop Chemistry Result ${emojis[0]}`,
    '',
    `💜 Idol: ${idolNameEn} (${idolNameKr}) - ${groupName}`,
    `🎯 Chemistry: ${chemistry}%`,
    `✨ My K-Pop Name: ${kpopNameKr} (${kpopNameEn})`,
    '',
    '🔗 kpopnamegenerator.com',
    '',
    groupTags.join(' '),
    '#KPop #IdolChemistry #KPopNameGenerator',
  ];
  
  return lines.join('\n');
}

/**
 * Generate share text for Instagram
 */
export function generateInstagramShareText(params: ShareTextParams): string {
  const { kpopNameKr, kpopNameEn, idolNameEn, groupName, chemistry, chemistryTier } = params;
  
  // Get group hashtags (more for Instagram)
  const groupTags = GROUP_HASHTAGS[groupName] || [`#${groupName.replace(/\s+/g, '')}`];
  
  const lines = [
    `✨ K-Pop Chemistry Test Result ✨`,
    '',
    `💜 ${idolNameEn} x Me = ${chemistry}%`,
    `🌟 My K-Pop Name: ${kpopNameKr}`,
    '',
    `Find yours at kpopnamegenerator.com`,
    '',
    '・・・',
    '',
    [...groupTags, '#KPop', '#케이팝', '#KPopFan', '#IdolChemistry', '#KPopNameGenerator', '#아이돌', '#덕질'].join(' '),
  ];
  
  return lines.join('\n');
}

/**
 * Generate share text for KakaoTalk
 */
export function generateKakaoShareText(params: ShareTextParams): string {
  const { kpopNameKr, idolNameEn, idolNameKr, groupName, chemistry } = params;
  
  const lines = [
    `💜 나의 케이팝 케미 결과!`,
    '',
    `🎤 ${idolNameEn}(${idolNameKr})와 케미 ${chemistry}%`,
    `✨ 나의 케이팝 이름: ${kpopNameKr}`,
    '',
    `👉 너도 해봐!`,
    `kpopnamegenerator.com`,
  ];
  
  return lines.join('\n');
}

/**
 * Generate VS Challenge share text
 */
export function generateVSChallengeShareText(
  challengerName: string,
  challengerScore: number,
  idolNameEn: string,
  groupName: string
): string {
  const groupTags = GROUP_HASHTAGS[groupName]?.slice(0, 2) || [`#${groupName.replace(/\s+/g, '')}`];
  
  const lines = [
    `⚔️ K-Pop Chemistry Battle!`,
    '',
    `${challengerName} got ${challengerScore}% with ${idolNameEn}`,
    `Think you can beat them?`,
    '',
    groupTags.join(' '),
    '#KPopChallenge #IdolChemistry',
  ];
  
  return lines.join('\n');
}

/**
 * Get share URL with UTM parameters
 */
export function getShareUrl(platform: 'twitter' | 'instagram' | 'kakao' | 'copy'): string {
  const baseUrl = 'https://kpopnamegenerator.com';
  return `${baseUrl}?utm_source=${platform}&utm_medium=share&utm_campaign=chemistry`;
}

