/**
 * Deep Analysis & Couple Name Generator
 * Provides detailed chemistry breakdown and ship names
 */

import { makeSeed, rand01 } from './seed';

// Helper: seeded random number in range [min, max]
function seededRandom(seed: number, min: number, max: number): number {
  return min + rand01(seed) * (max - min);
}

interface DeepAnalysisResult {
  overall: number;
  categories: {
    name: string;
    emoji: string;
    score: number;
    description: string;
  }[];
  destinyMessage: string;
  luckyColor: string;
  luckyNumber: number;
  recommendedSong: string;
}

interface CoupleNameResult {
  korean: string;
  english: string;
  cute: string;
  hashtag: string;
  fanficName: string;
  profileName: string;
}

// Analysis category templates
const CATEGORIES = [
  { name: 'Personality Match', emoji: '💫', descriptions: ['Perfect harmony!', 'Great balance!', 'Nice chemistry!', 'Interesting mix!'] },
  { name: 'Name Compatibility', emoji: '✨', descriptions: ['Destined names!', 'Names align beautifully!', 'Good name energy!', 'Unique combination!'] },
  { name: 'Fate Index', emoji: '🔮', descriptions: ['Written in stars!', 'Strong connection!', 'Fated encounter!', 'Cosmic link!'] },
  { name: 'Heart Bond', emoji: '💕', descriptions: ['Soulmates!', 'Deep bond!', 'Warm connection!', 'Sweet affinity!'] },
];

// Destiny messages based on overall score
const DESTINY_MESSAGES = {
  high: [
    "You two were destined to meet! The stars aligned for this connection. 💫",
    "Your souls recognize each other from a past life! ✨",
    "This chemistry is written in the universe's code! 🌟",
  ],
  medium: [
    "There's a beautiful connection forming between you two! 💜",
    "Your energies complement each other wonderfully! 🎵",
    "A meaningful bond is growing here! 💕",
  ],
  low: [
    "Every connection has its unique beauty! Keep believing! 💖",
    "Your bond is special in its own way! 🌸",
    "Sometimes the best relationships grow slowly! 🌱",
  ]
};

// Lucky colors
const LUCKY_COLORS = [
  { name: 'Purple', emoji: '💜' },
  { name: 'Pink', emoji: '💗' },
  { name: 'Blue', emoji: '💙' },
  { name: 'Gold', emoji: '💛' },
  { name: 'Silver', emoji: '🤍' },
  { name: 'Red', emoji: '❤️' },
];

// Songs by group (sample data)
const GROUP_SONGS: Record<string, string[]> = {
  'BTS': ['Dynamite', 'Butter', 'Spring Day', 'Boy With Luv', 'Fake Love'],
  'BLACKPINK': ['Pink Venom', 'How You Like That', 'Lovesick Girls', 'DDU-DU DDU-DU'],
  'Stray Kids': ['God\'s Menu', 'Back Door', 'MANIAC', 'S-Class', 'Thunderous'],
  'TWICE': ['Feel Special', 'What is Love?', 'Fancy', 'I Can\'t Stop Me'],
  'NewJeans': ['Ditto', 'Hype Boy', 'OMG', 'Super Shy', 'ETA'],
  'LE SSERAFIM': ['FEARLESS', 'ANTIFRAGILE', 'UNFORGIVEN', 'Perfect Night'],
  'EXO': ['Love Shot', 'Monster', 'Call Me Baby', 'Growl', 'Tempo'],
  'SEVENTEEN': ['Super', 'HOT', 'Don\'t Wanna Cry', 'Very Nice'],
  'TXT': ['Sugar Rush Ride', 'Good Boy Gone Bad', 'Anti-Romantic'],
  'ENHYPEN': ['Bite Me', 'Drunk-Dazed', 'Polaroid Love', 'Fever'],
  'IVE': ['I AM', 'LOVE DIVE', 'After LIKE', 'Kitsch'],
  'aespa': ['Next Level', 'Savage', 'Spicy', 'Drama'],
  'default': ['Your favorite song! 🎵'],
};

/**
 * Generate deep analysis results
 * @param variation - Re-roll count, changes ranking each time
 */
export function generateDeepAnalysis(
  userName: string,
  idolName: string,
  idolGroup: string,
  baseChemistry: number,
  variation: number = 0
): DeepAnalysisResult {
  // Each category gets a COMPLETELY INDEPENDENT seed
  // Using different string combinations ensures varied rankings for each user+idol
  const categories = CATEGORIES.map((cat, index) => {
    // Create unique seed using category-specific string patterns
    // The key is to use DIFFERENT string combinations, not just numeric offsets
    const seedStrings = [
      [userName, idolName, 'personality', variation],
      [idolName, userName, 'name-match', variation * 7],
      [userName.split('').reverse().join(''), idolName, 'fate', variation],
      [idolName.split('').reverse().join(''), userName, 'heart', variation * 13],
    ];
    
    const catSeed = makeSeed(...seedStrings[index]);
    
    // Policy: max = chemistry + 5, min = chemistry - 10
    // Generate variance: -10 to +5 range
    const rawRandom = rand01(catSeed); // 0 to 1
    const variance = (rawRandom * 15) - 10; // -10 to +5
    
    // Apply variance with absolute bounds (50% ~ 100%)
    const score = Math.min(100, Math.max(50, baseChemistry + variance));
    const descIndex = score >= 90 ? 0 : score >= 80 ? 1 : score >= 70 ? 2 : 3;
    
    return {
      name: cat.name,
      emoji: cat.emoji,
      score: Math.round(score),
      description: cat.descriptions[descIndex],
    };
  });
  
  const seed = makeSeed(userName, idolName, 'analysis');

  // Destiny message based on chemistry
  const messageCategory = baseChemistry >= 85 ? 'high' : baseChemistry >= 70 ? 'medium' : 'low';
  const messageIndex = seededRandom(seed, 0, DESTINY_MESSAGES[messageCategory].length - 1);
  const destinyMessage = DESTINY_MESSAGES[messageCategory][Math.floor(messageIndex)];

  // Lucky color
  const colorIndex = Math.floor(seededRandom(seed + 100, 0, LUCKY_COLORS.length - 0.01));
  const luckyColor = `${LUCKY_COLORS[colorIndex].name} ${LUCKY_COLORS[colorIndex].emoji}`;

  // Lucky number (1-9)
  const luckyNumber = Math.floor(seededRandom(seed + 200, 1, 10));

  // Recommended song
  const songs = GROUP_SONGS[idolGroup] || GROUP_SONGS['default'];
  const songIndex = Math.floor(seededRandom(seed + 300, 0, songs.length - 0.01));
  const recommendedSong = songs[songIndex];

  return {
    overall: baseChemistry,
    categories,
    destinyMessage,
    luckyColor,
    luckyNumber,
    recommendedSong,
  };
}

/**
 * Generate couple/ship names
 */
export function generateCoupleNames(
  userName: string,
  idolNameEn: string,
  idolNameKr: string
): CoupleNameResult {
  const userLower = userName.toLowerCase();
  const idolLower = idolNameEn.toLowerCase();
  
  // Get parts of names
  const userFirst = userName.slice(0, Math.ceil(userName.length / 2));
  const userLast = userName.slice(Math.floor(userName.length / 2));
  const idolFirst = idolNameEn.slice(0, Math.ceil(idolNameEn.length / 2));
  const idolLast = idolNameEn.slice(Math.floor(idolNameEn.length / 2));

  // Generate different combinations
  const combo1 = userFirst + idolLast.toLowerCase();
  const combo2 = idolFirst + userLast.toLowerCase();

  // Korean version (simple combination)
  const userKr = userName; // Keep original for Korean mix
  const korean = `${userKr.slice(0, 2)}${idolNameKr.slice(-1)}`;

  // English ship name (pick the shorter/catchier one)
  const english = combo1.length <= combo2.length ? combo1 : combo2;

  // Cute version
  const cuteOptions = [
    `${idolNameEn}♥${userName}`,
    `${userName}'s ${idolNameEn}`,
    `🐰${userName}+${idolNameEn}🐰`,
  ];
  const cute = cuteOptions[Math.floor(Math.random() * cuteOptions.length)];

  // Hashtag (no spaces, capitalized)
  const hashtag = `#${userName}${idolNameEn}`.replace(/\s+/g, '');

  // Fanfic author name
  const fanficName = `${userFirst}${idolNameKr.charAt(0)}`;

  // Profile name
  const profileName = `${idolNameEn}'s 💜 ${userName}`;

  return {
    korean,
    english: english.charAt(0).toUpperCase() + english.slice(1),
    cute,
    hashtag,
    fanficName,
    profileName,
  };
}

