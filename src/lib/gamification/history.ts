/**
 * History & Favorites System
 * Manages generation history and saved favorites
 */

export interface HistoryItem {
  id: string;
  timestamp: number;
  myName: string;
  idol: {
    group: string;
    nameEn: string;
    nameKr: string;
  };
  result: {
    nameKr: string;
    nameEn: string;
    chemistry: number;
  };
  relation: string;
}

const HISTORY_KEY = 'kpop-generation-history';
const FAVORITES_KEY = 'kpop-favorites';
const MAX_HISTORY = 50;
const MAX_FAVORITES = 20;

// History functions
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(HISTORY_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function addToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const history = getHistory();
  
  const newItem: HistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };
  
  history.unshift(newItem);
  
  // Keep only max items
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
  
  return newItem;
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

export function removeFromHistory(id: string): void {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  }
}

// Favorites functions
export function getFavorites(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function addToFavorites(item: HistoryItem): boolean {
  const favorites = getFavorites();
  
  // Check if already exists
  if (favorites.some(f => f.id === item.id)) {
    return false;
  }
  
  // Check max limit
  if (favorites.length >= MAX_FAVORITES) {
    return false;
  }
  
  favorites.unshift(item);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  
  return true;
}

export function removeFromFavorites(id: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter(item => item.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  }
}

export function isFavorite(id: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.id === id);
}

export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAVORITES_KEY);
}

// Format timestamp
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // Otherwise show date
  return date.toLocaleDateString();
}




