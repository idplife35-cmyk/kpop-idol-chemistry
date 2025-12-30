// =============================================
// Type Definitions for KPOP Idol Chemistry
// =============================================

export interface Member {
  id: string;
  nameKr: string;
  nameEn: string;
  gender: 'male' | 'female';
  position?: string[];
  birthYear?: number;
  image?: string;
}

export interface Group {
  id: string;
  name: string;
  nameKr?: string;
  slug: string;
  fandom?: string;
  company?: string;
  debutYear?: number;
  color?: string;
  logo?: string;
  description?: string;
  members: Member[];
  pageTypes: ('name' | 'stage-name' | 'aesthetic')[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface GeneratorResult {
  seed: number;
  finalGender: 'male' | 'female';
  chemistry: number;
  sameName: {
    full_kr: string;
    full_en: string;
  };
  styled: {
    full_kr: string;
    full_en: string;
  };
}

export interface GeneratorOptions {
  myName: string;
  idol: {
    group: string;
    name_kr: string;
    name_en: string;
    gender: 'male' | 'female';
  };
  genderPref: 'auto' | 'male' | 'female';
  relation: RelationType;
}

export type RelationType = 
  | 'lover'
  | 'friend'
  | 'rival'
  | 'sibling'
  | 'colleague'
  | 'soulmate';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'level' | 'generation' | 'chemistry' | 'vs' | 'challenge' | 'collection' | 'social';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface UserStats {
  totalGenerations: number;
  vsWins: number;
  vsTotal: number;
  shares: number;
  dailyStreak: number;
  maxChemistry: number;
  level: number;
  exp: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  myName: string;
  idol: {
    group: string;
    name_en: string;
    name_kr: string;
  };
  result: {
    name_kr: string;
    name_en: string;
    chemistry: number;
  };
  relation: RelationType;
}

