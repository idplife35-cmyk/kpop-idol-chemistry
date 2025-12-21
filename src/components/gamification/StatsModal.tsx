/**
 * Stats Modal Component
 * Displays detailed user statistics
 */
import { useState, useEffect } from 'react';
import {
  getLevelStats,
  getAllStats,
  getAllBadges,
  getBadgeProgress,
  RARITY_CONFIG
} from '../../lib/gamification';
import type { Badge } from '../../lib/gamification';
import styles from './StatsModal.module.css';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'stats' | 'badges';

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [levelStats, setLevelStats] = useState<ReturnType<typeof getLevelStats> | null>(null);
  const [userStats, setUserStats] = useState<ReturnType<typeof getAllStats> | null>(null);
  const [badges, setBadges] = useState<(Badge & { unlocked: boolean })[]>([]);
  const [badgeProgress, setBadgeProgress] = useState({ unlocked: 0, total: 0, percentage: 0 });

  useEffect(() => {
    if (isOpen) {
      setLevelStats(getLevelStats());
      setUserStats(getAllStats());
      setBadges(getAllBadges());
      setBadgeProgress(getBadgeProgress());
    }
  }, [isOpen]);

  if (!isOpen || !levelStats || !userStats) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>📊 My Stats</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Level Section */}
        <div className={styles.levelSection}>
          <div 
            className={styles.levelCircle}
            style={{ background: levelStats.levelColor }}
          >
            <span className={styles.levelNum}>{levelStats.level}</span>
          </div>
          <div className={styles.levelInfo}>
            <span className={styles.levelName}>{levelStats.levelName}</span>
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar}
                style={{ 
                  width: `${levelStats.progress}%`,
                  background: levelStats.levelColor
                }}
              />
            </div>
            <span className={styles.xpText}>
              {levelStats.totalXp} XP {levelStats.level < 5 && `(${levelStats.xpToNext} to next)`}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'badges' ? styles.active : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges ({badgeProgress.unlocked}/{badgeProgress.total})
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'stats' ? (
            <StatsContent stats={userStats} />
          ) : (
            <BadgesContent badges={badges} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatsContent({ stats }: { stats: ReturnType<typeof getAllStats> }) {
  return (
    <div className={styles.statsGrid}>
      <StatCard 
        label="Total Generations" 
        value={stats.totalGenerations.toString()} 
        icon="🎯"
      />
      <StatCard 
        label="Average Chemistry" 
        value={`${stats.averageChemistry}%`} 
        icon="💕"
      />
      <StatCard 
        label="Best Chemistry" 
        value={`${stats.bestChemistry}%`} 
        icon="🔥"
        sub={stats.bestChemistryName}
      />
      <StatCard 
        label="Days Active" 
        value={stats.daysSinceFirst.toString()} 
        icon="📅"
      />

      {stats.top3Idols.length > 0 && (
        <div className={styles.rankSection}>
          <h4 className={styles.rankTitle}>💖 Top Idols</h4>
          {stats.top3Idols.map((idol, i) => (
            <div key={idol.name} className={styles.rankItem}>
              <span className={styles.rankMedal}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </span>
              <span className={styles.rankName}>{idol.name}</span>
              <span className={styles.rankCount}>{idol.count}</span>
            </div>
          ))}
        </div>
      )}

      {stats.top3Groups.length > 0 && (
        <div className={styles.rankSection}>
          <h4 className={styles.rankTitle}>🎤 Top Groups</h4>
          {stats.top3Groups.map((group, i) => (
            <div key={group.name} className={styles.rankItem}>
              <span className={styles.rankMedal}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </span>
              <span className={styles.rankName}>{group.name}</span>
              <span className={styles.rankCount}>{group.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, sub }: { 
  label: string; 
  value: string; 
  icon: string;
  sub?: string;
}) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </div>
  );
}

function BadgesContent({ badges }: { badges: (Badge & { unlocked: boolean })[] }) {
  // Group badges by category
  const grouped = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, typeof badges>);

  const categoryNames: Record<string, string> = {
    level: '🎖️ Level',
    generation: '🎯 Generation',
    chemistry: '💕 Chemistry',
    vs: '⚔️ VS Mode',
    social: '📢 Social'
  };

  return (
    <div className={styles.badgesContainer}>
      {Object.entries(grouped).map(([category, categoryBadges]) => (
        <div key={category} className={styles.badgeCategory}>
          <h4 className={styles.categoryTitle}>{categoryNames[category] || category}</h4>
          <div className={styles.badgeGrid}>
            {categoryBadges.map(badge => (
              <div 
                key={badge.id}
                className={`${styles.badgeItem} ${badge.unlocked ? styles.unlocked : styles.locked}`}
                style={{
                  '--rarity-color': RARITY_CONFIG[badge.rarity].color,
                  '--rarity-glow': RARITY_CONFIG[badge.rarity].glow
                } as React.CSSProperties}
              >
                <span className={styles.badgeIcon}>
                  {badge.unlocked ? badge.icon : '🔒'}
                </span>
                <span className={styles.badgeName}>{badge.name}</span>
                <span className={styles.badgeDesc}>{badge.description}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

