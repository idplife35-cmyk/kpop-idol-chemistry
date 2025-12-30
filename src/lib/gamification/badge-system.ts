/**
 * Badge System
 * Manages achievements and badges
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'level' | 'generation' | 'chemistry' | 'vs' | 'challenge' | 'collection' | 'social';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export const BADGES: Record<string, Badge> = {
  // Level badges
  level_2: { id: 'level_2', name: 'Rising Star', description: 'Reach Level 2', icon: '🌟', category: 'level', rarity: 'common' },
  level_3: { id: 'level_3', name: 'Expert Path', description: 'Reach Level 3', icon: '⭐', category: 'level', rarity: 'uncommon' },
  level_4: { id: 'level_4', name: 'Master Rank', description: 'Reach Level 4', icon: '💫', category: 'level', rarity: 'rare' },
  level_5: { id: 'level_5', name: 'Legend Born', description: 'Reach Level 5', icon: '✨', category: 'level', rarity: 'legendary' },

  // Generation badges
  first_gen: { id: 'first_gen', name: 'First Step', description: 'First name generated', icon: '🎯', category: 'generation', rarity: 'common' },
  gen_10: { id: 'gen_10', name: 'Getting Started', description: '10 generations', icon: '🔥', category: 'generation', rarity: 'common' },
  gen_50: { id: 'gen_50', name: 'Name Enthusiast', description: '50 generations', icon: '💯', category: 'generation', rarity: 'uncommon' },
  gen_100: { id: 'gen_100', name: 'Century Club', description: '100 generations', icon: '🏆', category: 'generation', rarity: 'rare' },
  gen_500: { id: 'gen_500', name: 'Name Legend', description: '500 generations', icon: '👑', category: 'generation', rarity: 'legendary' },

  // Chemistry badges
  chemistry_90: { id: 'chemistry_90', name: 'Perfect Match', description: '90%+ chemistry', icon: '💖', category: 'chemistry', rarity: 'uncommon' },
  chemistry_95: { id: 'chemistry_95', name: 'Destined Pair', description: '95%+ chemistry', icon: '💝', category: 'chemistry', rarity: 'rare' },
  chemistry_100: { id: 'chemistry_100', name: 'Soulmate', description: '100% chemistry!', icon: '💘', category: 'chemistry', rarity: 'legendary' },

  // VS Mode badges
  vs_first: { id: 'vs_first', name: 'First Battle', description: 'First VS mode', icon: '⚔️', category: 'vs', rarity: 'common' },
  vs_10_wins: { id: 'vs_10_wins', name: 'Battle Master', description: '10 VS wins', icon: '🥊', category: 'vs', rarity: 'rare' },

  // Social badges
  share_first: { id: 'share_first', name: 'First Share', description: 'First share', icon: '📢', category: 'social', rarity: 'common' },
  share_10: { id: 'share_10', name: 'Influencer', description: '10 shares', icon: '📣', category: 'social', rarity: 'uncommon' }
};

export const RARITY_CONFIG = {
  common: { name: 'Common', color: '#9E9E9E', glow: 'none' },
  uncommon: { name: 'Uncommon', color: '#4CAF50', glow: '0 0 10px #4CAF50' },
  rare: { name: 'Rare', color: '#2196F3', glow: '0 0 15px #2196F3' },
  legendary: { name: 'Legendary', color: '#FF9800', glow: '0 0 20px #FF9800' }
} as const;

interface BadgeData {
  badges: string[];
  unlockedAt: Record<string, string>;
  stats: {
    vsWins: number;
    vsTotal: number;
    shares: number;
    maxChemistry: number;
  };
}

const STORAGE_KEY = 'kpop-user-badges';

export function getBadgeData(): BadgeData {
  if (typeof window === 'undefined') {
    return getDefaultBadgeData();
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const data = getDefaultBadgeData();
    saveBadgeData(data);
    return data;
  }
  
  return JSON.parse(saved);
}

function getDefaultBadgeData(): BadgeData {
  return {
    badges: [],
    unlockedAt: {},
    stats: { vsWins: 0, vsTotal: 0, shares: 0, maxChemistry: 0 }
  };
}

export function saveBadgeData(data: BadgeData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function hasBadge(badgeId: string): boolean {
  const data = getBadgeData();
  return data.badges.includes(badgeId);
}

export function unlockBadge(badgeId: string): { unlocked: boolean; badge?: Badge } {
  if (hasBadge(badgeId)) return { unlocked: false };
  
  const badge = BADGES[badgeId];
  if (!badge) return { unlocked: false };
  
  const data = getBadgeData();
  data.badges.push(badgeId);
  data.unlockedAt[badgeId] = new Date().toISOString();
  saveBadgeData(data);
  
  return { unlocked: true, badge };
}

export function getUnlockedBadges(): (Badge & { unlockedAt: string })[] {
  const data = getBadgeData();
  return data.badges.map(id => ({
    ...BADGES[id],
    unlockedAt: data.unlockedAt[id]
  }));
}

export function getAllBadges(): (Badge & { unlocked: boolean; unlockedAt?: string })[] {
  const data = getBadgeData();
  return Object.values(BADGES).map(badge => ({
    ...badge,
    unlocked: data.badges.includes(badge.id),
    unlockedAt: data.unlockedAt[badge.id]
  }));
}

export function getBadgeProgress(): { unlocked: number; total: number; percentage: number } {
  const data = getBadgeData();
  const total = Object.keys(BADGES).length;
  const unlocked = data.badges.length;
  return {
    unlocked,
    total,
    percentage: Math.round((unlocked / total) * 100)
  };
}

// Badge check functions
export function checkLevelBadges(level: number): void {
  if (level >= 2) unlockBadge('level_2');
  if (level >= 3) unlockBadge('level_3');
  if (level >= 4) unlockBadge('level_4');
  if (level >= 5) unlockBadge('level_5');
}

export function checkGenerationBadges(count: number): void {
  if (count >= 1) unlockBadge('first_gen');
  if (count >= 10) unlockBadge('gen_10');
  if (count >= 50) unlockBadge('gen_50');
  if (count >= 100) unlockBadge('gen_100');
  if (count >= 500) unlockBadge('gen_500');
}

export function checkChemistryBadges(score: number): { unlocked: Badge[] } {
  const unlocked: Badge[] = [];
  
  const data = getBadgeData();
  if (score > data.stats.maxChemistry) {
    data.stats.maxChemistry = score;
    saveBadgeData(data);
  }
  
  if (score >= 90) {
    const result = unlockBadge('chemistry_90');
    if (result.unlocked && result.badge) unlocked.push(result.badge);
  }
  if (score >= 95) {
    const result = unlockBadge('chemistry_95');
    if (result.unlocked && result.badge) unlocked.push(result.badge);
  }
  if (score >= 100) {
    const result = unlockBadge('chemistry_100');
    if (result.unlocked && result.badge) unlocked.push(result.badge);
  }
  
  return { unlocked };
}

export function checkVSBadges(won: boolean): void {
  const data = getBadgeData();
  data.stats.vsTotal++;
  if (won) data.stats.vsWins++;
  saveBadgeData(data);
  
  if (data.stats.vsTotal >= 1) unlockBadge('vs_first');
  if (data.stats.vsWins >= 10) unlockBadge('vs_10_wins');
}

export function checkShareBadges(): void {
  const data = getBadgeData();
  data.stats.shares++;
  saveBadgeData(data);
  
  if (data.stats.shares >= 1) unlockBadge('share_first');
  if (data.stats.shares >= 10) unlockBadge('share_10');
}

export function resetBadges(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}


