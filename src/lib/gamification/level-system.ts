/**
 * Level System
 * Manages user levels, XP, and progression
 */

export interface LevelConfig {
  name: string;
  xpRequired: number;
  color: string;
}

export const LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { name: '신입 팬', xpRequired: 0, color: '#9E9E9E' },
  2: { name: '열정 팬', xpRequired: 10, color: '#4CAF50' },
  3: { name: '전문 팬', xpRequired: 30, color: '#2196F3' },
  4: { name: '마스터 팬', xpRequired: 70, color: '#9C27B0' },
  5: { name: '레전드', xpRequired: 150, color: '#FF9800' }
};

export const XP_REWARDS = {
  generate: 1,
  high_chemistry: 2,
  perfect_chemistry: 5,
  vs_battle: 2,
  share: 1,
  daily_challenge: 10,
  collection_complete: 20
} as const;

export type XPRewardType = keyof typeof XP_REWARDS;

interface LevelData {
  level: number;
  xp: number;
  totalXp: number;
  totalGenerations: number;
  createdAt: string;
  lastActive: string;
}

const STORAGE_KEY = 'kpop-user-level';

// Initialize or get level data
export function getLevelData(): LevelData {
  if (typeof window === 'undefined') {
    return getDefaultData();
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const data = getDefaultData();
    saveLevelData(data);
    return data;
  }
  
  return JSON.parse(saved);
}

function getDefaultData(): LevelData {
  return {
    level: 1,
    xp: 0,
    totalXp: 0,
    totalGenerations: 0,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
}

export function saveLevelData(data: LevelData): void {
  if (typeof window === 'undefined') return;
  data.lastActive = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Get level info
export function getLevelName(level: number): string {
  return LEVEL_CONFIG[level]?.name || '신입 팬';
}

export function getLevelColor(level: number): string {
  return LEVEL_CONFIG[level]?.color || '#9E9E9E';
}

export function getXPToNextLevel(data: LevelData): number {
  const nextLevel = data.level + 1;
  if (nextLevel > 5) return 0;
  return LEVEL_CONFIG[nextLevel].xpRequired - data.totalXp;
}

export function getLevelProgress(data: LevelData): number {
  if (data.level >= 5) return 100;
  
  const currentLevelStart = LEVEL_CONFIG[data.level].xpRequired;
  const nextLevelStart = LEVEL_CONFIG[data.level + 1].xpRequired;
  const range = nextLevelStart - currentLevelStart;
  const progress = data.totalXp - currentLevelStart;
  
  return Math.min(100, Math.round((progress / range) * 100));
}

// Add XP and check for level up
export interface AddXPResult {
  leveledUp: boolean;
  newLevel?: number;
  xpGained: number;
  data: LevelData;
}

export function addXP(amount: number, reason: XPRewardType = 'generate'): AddXPResult {
  const data = getLevelData();
  const oldLevel = data.level;
  
  data.xp += amount;
  data.totalXp += amount;
  
  if (reason === 'generate' || reason === 'high_chemistry' || reason === 'perfect_chemistry') {
    data.totalGenerations++;
  }
  
  // Check level up
  let leveledUp = false;
  while (data.level < 5 && data.totalXp >= LEVEL_CONFIG[data.level + 1].xpRequired) {
    data.level++;
    leveledUp = true;
  }
  
  saveLevelData(data);
  
  return {
    leveledUp,
    newLevel: leveledUp ? data.level : undefined,
    xpGained: amount,
    data
  };
}

// Get stats
export function getLevelStats() {
  const data = getLevelData();
  return {
    level: data.level,
    levelName: getLevelName(data.level),
    levelColor: getLevelColor(data.level),
    xp: data.xp,
    totalXp: data.totalXp,
    totalGenerations: data.totalGenerations,
    xpToNext: getXPToNextLevel(data),
    progress: getLevelProgress(data),
    daysActive: getDaysActive(data)
  };
}

function getDaysActive(data: LevelData): number {
  const created = new Date(data.createdAt);
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

// Reset (for testing)
export function resetLevel(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

