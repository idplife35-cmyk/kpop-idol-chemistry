// ========================================
// 📊 통계 시스템
// ========================================

class StatsSystem {
  constructor() {
    this.storageKey = 'kpop-user-stats';
    this.initialize();
  }

  // 초기화
  initialize() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      this.data = {
        favoriteIdols: {},      // { '정국': 15, '지민': 10 }
        favoriteGroups: {},     // { 'BTS': 25, 'BLACKPINK': 12 }
        favoriteRelations: {},  // { 'lover': 10, 'bestfriend': 8 }
        totalGenerations: 0,
        averageChemistry: 0,
        bestChemistry: 0,
        bestChemistryName: '',
        totalChemistry: 0,
        firstGeneration: new Date().toISOString()
      };
      this.save();
    } else {
      this.data = JSON.parse(saved);
    }
  }

  // 생성 기록 추가
  recordGeneration(idolName, groupName, relation, chemistry, generatedName) {
    // 아이돌 카운트
    this.data.favoriteIdols[idolName] = (this.data.favoriteIdols[idolName] || 0) + 1;
    
    // 그룹 카운트
    this.data.favoriteGroups[groupName] = (this.data.favoriteGroups[groupName] || 0) + 1;
    
    // 관계 타입 카운트
    this.data.favoriteRelations[relation] = (this.data.favoriteRelations[relation] || 0) + 1;
    
    // 케미 점수
    this.data.totalGenerations++;
    this.data.totalChemistry += chemistry;
    this.data.averageChemistry = Math.round(this.data.totalChemistry / this.data.totalGenerations);
    
    // 최고 케미 기록
    if (chemistry > this.data.bestChemistry) {
      this.data.bestChemistry = chemistry;
      this.data.bestChemistryName = generatedName;
    }
    
    this.save();
  }

  // Top 3 아이돌
  getTop3Idols() {
    const sorted = Object.entries(this.data.favoriteIdols)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    return sorted.map(([name, count]) => ({ name, count }));
  }

  // Top 3 그룹
  getTop3Groups() {
    const sorted = Object.entries(this.data.favoriteGroups)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    return sorted.map(([name, count]) => ({ name, count }));
  }

  // 가장 좋아하는 관계 타입
  getFavoriteRelation() {
    const sorted = Object.entries(this.data.favoriteRelations)
      .sort(([, a], [, b]) => b - a);
    
    if (sorted.length === 0) return null;
    return { type: sorted[0][0], count: sorted[0][1] };
  }

  // 전체 통계
  getAllStats() {
    return {
      totalGenerations: this.data.totalGenerations,
      averageChemistry: this.data.averageChemistry,
      bestChemistry: this.data.bestChemistry,
      bestChemistryName: this.data.bestChemistryName,
      top3Idols: this.getTop3Idols(),
      top3Groups: this.getTop3Groups(),
      favoriteRelation: this.getFavoriteRelation(),
      daysSinceFirst: this.getDaysSinceFirst()
    };
  }

  // 첫 생성 이후 일수
  getDaysSinceFirst() {
    const first = new Date(this.data.firstGeneration);
    const now = new Date();
    const diff = now - first;
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
  module.exports = { StatsSystem };
}


