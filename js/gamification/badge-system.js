// ========================================
// 🏆 배지 시스템
// ========================================

const BADGES = {
  // 레벨 배지
  level_2: {
    id: 'level_2',
    name: '열정적인 팬',
    description: '레벨 2 달성',
    icon: '🌟',
    category: 'level',
    rarity: 'common'
  },
  level_3: {
    id: 'level_3',
    name: '전문가의 길',
    description: '레벨 3 달성',
    icon: '⭐',
    category: 'level',
    rarity: 'uncommon'
  },
  level_4: {
    id: 'level_4',
    name: '마스터 등극',
    description: '레벨 4 달성',
    icon: '💫',
    category: 'level',
    rarity: 'rare'
  },
  level_5: {
    id: 'level_5',
    name: '레전드 탄생',
    description: '레벨 5 달성',
    icon: '✨',
    category: 'level',
    rarity: 'legendary'
  },

  // 생성 횟수 배지
  first_gen: {
    id: 'first_gen',
    name: '첫 발걸음',
    description: '첫 이름 생성',
    icon: '🎯',
    category: 'generation',
    rarity: 'common'
  },
  gen_10: {
    id: 'gen_10',
    name: '열정의 시작',
    description: '10번 생성',
    icon: '🔥',
    category: 'generation',
    rarity: 'common'
  },
  gen_50: {
    id: 'gen_50',
    name: '이름 마니아',
    description: '50번 생성',
    icon: '💯',
    category: 'generation',
    rarity: 'uncommon'
  },
  gen_100: {
    id: 'gen_100',
    name: '백전백승',
    description: '100번 생성',
    icon: '🏆',
    category: 'generation',
    rarity: 'rare'
  },
  gen_500: {
    id: 'gen_500',
    name: '전설의 생성자',
    description: '500번 생성',
    icon: '👑',
    category: 'generation',
    rarity: 'legendary'
  },

  // 케미 점수 배지
  chemistry_90: {
    id: 'chemistry_90',
    name: '완벽한 매치',
    description: '케미 90점 이상',
    icon: '💖',
    category: 'chemistry',
    rarity: 'uncommon'
  },
  chemistry_95: {
    id: 'chemistry_95',
    name: '운명적 만남',
    description: '케미 95점 이상',
    icon: '💝',
    category: 'chemistry',
    rarity: 'rare'
  },
  chemistry_100: {
    id: 'chemistry_100',
    name: '천생연분',
    description: '케미 100점!',
    icon: '💘',
    category: 'chemistry',
    rarity: 'legendary'
  },

  // VS 모드 배지
  vs_first: {
    id: 'vs_first',
    name: '첫 대결',
    description: '첫 VS 모드',
    icon: '⚔️',
    category: 'vs',
    rarity: 'common'
  },
  vs_10_wins: {
    id: 'vs_10_wins',
    name: '대결 고수',
    description: 'VS 모드 10승',
    icon: '🥊',
    category: 'vs',
    rarity: 'rare'
  },

  // 일일 도전 배지
  daily_first: {
    id: 'daily_first',
    name: '도전 시작',
    description: '첫 일일 도전 완료',
    icon: '📋',
    category: 'challenge',
    rarity: 'common'
  },
  daily_streak_7: {
    id: 'daily_streak_7',
    name: '일주일의 열정',
    description: '7일 연속 도전 완료',
    icon: '🔥',
    category: 'challenge',
    rarity: 'rare'
  },

  // 컬렉션 배지
  collection_group: {
    id: 'collection_group',
    name: '그룹 콜렉터',
    description: '한 그룹 전체 컬렉션',
    icon: '📚',
    category: 'collection',
    rarity: 'uncommon'
  },
  collection_all: {
    id: 'collection_all',
    name: 'K-Pop 마스터',
    description: '전체 그룹 컬렉션',
    icon: '🎤',
    category: 'collection',
    rarity: 'legendary'
  },

  // 소셜 배지
  share_first: {
    id: 'share_first',
    name: '공유의 시작',
    description: '첫 공유',
    icon: '📢',
    category: 'social',
    rarity: 'common'
  },
  share_10: {
    id: 'share_10',
    name: '전파의 달인',
    description: '10번 공유',
    icon: '📣',
    category: 'social',
    rarity: 'uncommon'
  }
};

const RARITY_CONFIG = {
  common: { name: '일반', color: '#9E9E9E', glow: 'none' },
  uncommon: { name: '희귀', color: '#4CAF50', glow: '0 0 10px #4CAF50' },
  rare: { name: '레어', color: '#2196F3', glow: '0 0 15px #2196F3' },
  legendary: { name: '전설', color: '#FF9800', glow: '0 0 20px #FF9800' }
};

class BadgeSystem {
  constructor() {
    this.storageKey = 'kpop-user-badges';
    this.initialize();
  }

  // 초기화
  initialize() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      this.data = {
        badges: [],
        unlockedAt: {},
        stats: {
          vsWins: 0,
          vsTotal: 0,
          shares: 0,
          dailyStreak: 0,
          maxChemistry: 0
        }
      };
      this.save();
    } else {
      this.data = JSON.parse(saved);
    }
  }

  // 배지 획득 여부
  hasBadge(badgeId) {
    return this.data.badges.includes(badgeId);
  }

  // 배지 획득
  unlockBadge(badgeId, silent = false) {
    if (this.hasBadge(badgeId)) return false;
    
    const badge = BADGES[badgeId];
    if (!badge) return false;
    
    this.data.badges.push(badgeId);
    this.data.unlockedAt[badgeId] = new Date().toISOString();
    this.save();
    
    // 알림 표시
    if (!silent) {
      this.showBadgeNotification(badge);
    }
    
    return true;
  }

  // 배지 알림 표시
  showBadgeNotification(badge) {
    const rarity = RARITY_CONFIG[badge.rarity];
    const message = `🏆 새 배지 획득!\n\n${badge.icon} ${badge.name}\n${badge.description}`;
    
    if (window.showNotification) {
      window.showNotification(message, 'badge');
    } else {
      alert(message);
    }
  }

  // 획득한 배지 목록
  getUnlockedBadges() {
    return this.data.badges.map(id => ({
      ...BADGES[id],
      unlockedAt: this.data.unlockedAt[id]
    }));
  }

  // 전체 배지 목록 (잠긴 것 포함)
  getAllBadges() {
    return Object.values(BADGES).map(badge => ({
      ...badge,
      unlocked: this.hasBadge(badge.id),
      unlockedAt: this.data.unlockedAt[badge.id]
    }));
  }

  // 카테고리별 배지
  getBadgesByCategory(category) {
    return this.getAllBadges().filter(b => b.category === category);
  }

  // 배지 진행도
  getProgress() {
    const total = Object.keys(BADGES).length;
    const unlocked = this.data.badges.length;
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100)
    };
  }

  // 레벨 배지 체크
  checkLevelBadges(level) {
    const badgeId = `level_${level}`;
    this.unlockBadge(badgeId);
  }

  // 생성 횟수 배지 체크
  checkGenerationBadges(count) {
    if (count === 1) this.unlockBadge('first_gen');
    if (count >= 10) this.unlockBadge('gen_10');
    if (count >= 50) this.unlockBadge('gen_50');
    if (count >= 100) this.unlockBadge('gen_100');
    if (count >= 500) this.unlockBadge('gen_500');
  }

  // 케미 점수 배지 체크
  checkChemistryBadges(score) {
    // 최고 점수 업데이트
    if (score > this.data.stats.maxChemistry) {
      this.data.stats.maxChemistry = score;
      this.save();
    }
    
    if (score >= 90) this.unlockBadge('chemistry_90');
    if (score >= 95) this.unlockBadge('chemistry_95');
    if (score >= 100) this.unlockBadge('chemistry_100');
  }

  // VS 모드 배지 체크
  checkVSBadges(won) {
    this.data.stats.vsTotal++;
    if (won) this.data.stats.vsWins++;
    this.save();
    
    if (this.data.stats.vsTotal === 1) this.unlockBadge('vs_first');
    if (this.data.stats.vsWins >= 10) this.unlockBadge('vs_10_wins');
  }

  // 공유 배지 체크
  checkShareBadges() {
    this.data.stats.shares++;
    this.save();
    
    if (this.data.stats.shares === 1) this.unlockBadge('share_first');
    if (this.data.stats.shares >= 10) this.unlockBadge('share_10');
  }

  // 일일 도전 배지 체크
  checkDailyBadges(streak) {
    this.data.stats.dailyStreak = streak;
    this.save();
    
    if (streak === 1) this.unlockBadge('daily_first');
    if (streak >= 7) this.unlockBadge('daily_streak_7');
  }

  // 통계 가져오기
  getStats() {
    return { ...this.data.stats };
  }

  // 저장
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  // 리셋 (테스트용)
  reset() {
    localStorage.removeItem(this.storageKey);
    this.initialize();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BadgeSystem, BADGES, RARITY_CONFIG };
}


