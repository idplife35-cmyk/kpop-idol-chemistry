// ========================================
// 🎮 레벨 시스템
// ========================================

const LEVEL_CONFIG = {
  1: { name: '신입 팬', xpRequired: 0, color: '#9E9E9E' },
  2: { name: '열정 팬', xpRequired: 10, color: '#4CAF50' },
  3: { name: '전문 팬', xpRequired: 30, color: '#2196F3' },
  4: { name: '마스터 팬', xpRequired: 70, color: '#9C27B0' },
  5: { name: '레전드', xpRequired: 150, color: '#FF9800' }
};

const XP_REWARDS = {
  generate: 1,           // 이름 생성
  high_chemistry: 2,     // 90점 이상
  perfect_chemistry: 5,  // 100점
  vs_battle: 2,          // VS 모드
  share: 1,              // 공유
  daily_challenge: 10,   // 일일 도전 완료
  collection_complete: 20 // 컬렉션 완성
};

class LevelSystem {
  constructor() {
    this.storageKey = 'kpop-user-level';
    this.initialize();
  }

  // 초기화
  initialize() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      this.data = {
        level: 1,
        xp: 0,
        totalXp: 0,
        totalGenerations: 0,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      this.save();
    } else {
      this.data = JSON.parse(saved);
      this.data.lastActive = new Date().toISOString();
      this.save();
    }
  }

  // 현재 레벨 정보 가져오기
  getCurrentLevel() {
    return this.data.level;
  }

  // 현재 XP 가져오기
  getCurrentXP() {
    return this.data.xp;
  }

  // 레벨 이름 가져오기
  getLevelName(level = null) {
    const lvl = level || this.data.level;
    return LEVEL_CONFIG[lvl]?.name || '신입 팬';
  }

  // 레벨 색상 가져오기
  getLevelColor(level = null) {
    const lvl = level || this.data.level;
    return LEVEL_CONFIG[lvl]?.color || '#9E9E9E';
  }

  // 다음 레벨까지 필요한 XP
  getXPToNextLevel() {
    const nextLevel = this.data.level + 1;
    if (nextLevel > 5) return 0; // 최대 레벨
    return LEVEL_CONFIG[nextLevel].xpRequired - this.data.totalXp;
  }

  // 다음 레벨 필요 총 XP
  getNextLevelTotalXP() {
    const nextLevel = this.data.level + 1;
    if (nextLevel > 5) return this.data.totalXp; // 최대 레벨
    return LEVEL_CONFIG[nextLevel].xpRequired;
  }

  // 현재 레벨 시작 XP
  getCurrentLevelStartXP() {
    return LEVEL_CONFIG[this.data.level].xpRequired;
  }

  // 현재 레벨 진행도 (%)
  getLevelProgress() {
    if (this.data.level >= 5) return 100;
    
    const currentLevelStart = this.getCurrentLevelStartXP();
    const nextLevelStart = this.getNextLevelTotalXP();
    const range = nextLevelStart - currentLevelStart;
    const progress = this.data.totalXp - currentLevelStart;
    
    return Math.min(100, Math.round((progress / range) * 100));
  }

  // 경험치 획득
  addXP(amount, reason = 'generate') {
    const oldLevel = this.data.level;
    
    this.data.xp += amount;
    this.data.totalXp += amount;
    
    // 생성 횟수 카운트
    if (reason === 'generate' || reason === 'high_chemistry' || reason === 'perfect_chemistry') {
      this.data.totalGenerations++;
    }
    
    // 레벨업 체크
    const leveledUp = this.checkLevelUp();
    
    this.save();
    
    // 레벨업 이벤트 발생
    if (leveledUp) {
      this.onLevelUp(oldLevel, this.data.level);
      return { leveledUp: true, newLevel: this.data.level, xpGained: amount };
    }
    
    return { leveledUp: false, xpGained: amount };
  }

  // 레벨업 체크
  checkLevelUp() {
    if (this.data.level >= 5) return false; // 최대 레벨
    
    const nextLevel = this.data.level + 1;
    const requiredXP = LEVEL_CONFIG[nextLevel].xpRequired;
    
    if (this.data.totalXp >= requiredXP) {
      this.data.level = nextLevel;
      this.data.xp = this.data.totalXp - requiredXP;
      return true;
    }
    
    return false;
  }

  // 레벨업 이벤트 핸들러
  onLevelUp(oldLevel, newLevel) {
    console.log(`🎉 레벨업! ${oldLevel} → ${newLevel}`);
    
    // 배지 시스템에 알림
    if (window.badgeSystem) {
      window.badgeSystem.checkLevelBadges(newLevel);
    }
    
    // UI 업데이트
    this.showLevelUpNotification(newLevel);
  }

  // 레벨업 알림 표시
  showLevelUpNotification(newLevel) {
    const levelName = this.getLevelName(newLevel);
    const color = this.getLevelColor(newLevel);
    
    // 간단한 알림 (나중에 더 예쁘게 만들 수 있음)
    if (window.showNotification) {
      window.showNotification(`🎉 레벨업! Level ${newLevel} - ${levelName}`, 'success');
    } else {
      alert(`🎉 축하합니다!\n\nLevel ${newLevel} - ${levelName} 달성!`);
    }
  }

  // 전체 데이터 가져오기
  getData() {
    return { ...this.data };
  }

  // 통계 가져오기
  getStats() {
    return {
      level: this.data.level,
      levelName: this.getLevelName(),
      xp: this.data.xp,
      totalXp: this.data.totalXp,
      totalGenerations: this.data.totalGenerations,
      xpToNext: this.getXPToNextLevel(),
      progress: this.getLevelProgress(),
      daysActive: this.getDaysActive()
    };
  }

  // 활동 일수 계산
  getDaysActive() {
    const created = new Date(this.data.createdAt);
    const now = new Date();
    const diff = now - created;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
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
  module.exports = { LevelSystem, LEVEL_CONFIG, XP_REWARDS };
}


