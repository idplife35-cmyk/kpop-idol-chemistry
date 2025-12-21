/**
 * Stats System
 * Tracks user statistics and preferences
 */

interface StatsData {
  favoriteIdols: Record<string, number>;
  favoriteGroups: Record<string, number>;
  favoriteRelations: Record<string, number>;
  totalGenerations: number;
  averageChemistry: number;
  bestChemistry: number;
  bestChemistryName: string;
  totalChemistry: number;
  firstGeneration: string;
}

const STORAGE_KEY = 'kpop-user-stats';

export function getStatsData(): StatsData {
  if (typeof window === 'undefined') {
    return getDefaultStatsData();
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const data = getDefaultStatsData();
    saveStatsData(data);
    return data;
  }
  
  return JSON.parse(saved);
}

function getDefaultStatsData(): StatsData {
  return {
    favoriteIdols: {},
    favoriteGroups: {},
    favoriteRelations: {},
    totalGenerations: 0,
    averageChemistry: 0,
    bestChemistry: 0,
    bestChemistryName: '',
    totalChemistry: 0,
    firstGeneration: new Date().toISOString()
  };
}

export function saveStatsData(data: StatsData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function recordGeneration(
  idolName: string,
  groupName: string,
  relation: string,
  chemistry: number,
  generatedName: string
): void {
  const data = getStatsData();
  
  // Count idol
  data.favoriteIdols[idolName] = (data.favoriteIdols[idolName] || 0) + 1;
  
  // Count group
  data.favoriteGroups[groupName] = (data.favoriteGroups[groupName] || 0) + 1;
  
  // Count relation
  data.favoriteRelations[relation] = (data.favoriteRelations[relation] || 0) + 1;
  
  // Chemistry stats
  data.totalGenerations++;
  data.totalChemistry += chemistry;
  data.averageChemistry = Math.round(data.totalChemistry / data.totalGenerations);
  
  // Best chemistry
  if (chemistry > data.bestChemistry) {
    data.bestChemistry = chemistry;
    data.bestChemistryName = generatedName;
  }
  
  saveStatsData(data);
}

export function getTop3Idols(): { name: string; count: number }[] {
  const data = getStatsData();
  return Object.entries(data.favoriteIdols)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));
}

export function getTop3Groups(): { name: string; count: number }[] {
  const data = getStatsData();
  return Object.entries(data.favoriteGroups)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));
}

export function getFavoriteRelation(): { type: string; count: number } | null {
  const data = getStatsData();
  const sorted = Object.entries(data.favoriteRelations)
    .sort(([, a], [, b]) => b - a);
  
  if (sorted.length === 0) return null;
  return { type: sorted[0][0], count: sorted[0][1] };
}

export function getAllStats() {
  const data = getStatsData();
  return {
    totalGenerations: data.totalGenerations,
    averageChemistry: data.averageChemistry,
    bestChemistry: data.bestChemistry,
    bestChemistryName: data.bestChemistryName,
    top3Idols: getTop3Idols(),
    top3Groups: getTop3Groups(),
    favoriteRelation: getFavoriteRelation(),
    daysSinceFirst: getDaysSinceFirst(data)
  };
}

function getDaysSinceFirst(data: StatsData): number {
  const first = new Date(data.firstGeneration);
  const now = new Date();
  const diff = now.getTime() - first.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export function resetStats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

