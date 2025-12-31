/**
 * Gamification System Index
 * Exports all gamification-related functionality
 */

// Level System
export {
  LEVEL_CONFIG,
  XP_REWARDS,
  getLevelData,
  saveLevelData,
  getLevelName,
  getLevelColor,
  getXPToNextLevel,
  getLevelProgress,
  addXP,
  getLevelStats,
  resetLevel
} from './level-system';
export type { LevelConfig, XPRewardType, AddXPResult } from './level-system';

// Badge System
export {
  BADGES,
  RARITY_CONFIG,
  getBadgeData,
  saveBadgeData,
  hasBadge,
  unlockBadge,
  getUnlockedBadges,
  getAllBadges,
  getBadgeProgress,
  checkLevelBadges,
  checkGenerationBadges,
  checkChemistryBadges,
  checkVSBadges,
  checkShareBadges,
  resetBadges
} from './badge-system';
export type { Badge } from './badge-system';

// Stats System
export {
  getStatsData,
  saveStatsData,
  recordGeneration,
  getTop3Idols,
  getTop3Groups,
  getFavoriteRelation,
  getAllStats,
  resetStats
} from './stats';

// History System
export {
  getHistory,
  addToHistory,
  clearHistory,
  removeFromHistory,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  clearFavorites,
  formatTimestamp
} from './history';
export type { HistoryItem } from './history';




