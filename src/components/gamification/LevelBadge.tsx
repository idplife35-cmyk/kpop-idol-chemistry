/**
 * Level Badge Component
 * Displays user's current level with progress bar
 */
import { useState, useEffect } from 'react';
import { getLevelStats } from '../../lib/gamification';
import styles from './LevelBadge.module.css';

interface LevelBadgeProps {
  compact?: boolean;
  onClick?: () => void;
}

export default function LevelBadge({ compact = false, onClick }: LevelBadgeProps) {
  const [stats, setStats] = useState<ReturnType<typeof getLevelStats> | null>(null);

  useEffect(() => {
    setStats(getLevelStats());
    
    // Listen for level updates
    const handleUpdate = () => {
      setStats(getLevelStats());
    };
    
    window.addEventListener('levelUpdate', handleUpdate);
    return () => window.removeEventListener('levelUpdate', handleUpdate);
  }, []);

  if (!stats) return null;

  if (compact) {
    return (
      <button 
        className={styles.compactBadge}
        onClick={onClick}
        style={{ '--level-color': stats.levelColor } as React.CSSProperties}
      >
        <span className={styles.levelIcon}>Lv.{stats.level}</span>
        <span className={styles.levelName}>{stats.levelName}</span>
      </button>
    );
  }

  return (
    <div className={styles.levelBadge} onClick={onClick}>
      <div className={styles.header}>
        <div 
          className={styles.levelCircle}
          style={{ background: stats.levelColor }}
        >
          {stats.level}
        </div>
        <div className={styles.info}>
          <span className={styles.title}>{stats.levelName}</span>
          <span className={styles.xp}>{stats.totalXp} XP</span>
        </div>
      </div>
      
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar}
          style={{ 
            width: `${stats.progress}%`,
            background: stats.levelColor
          }}
        />
      </div>
      
      {stats.level < 5 && (
        <div className={styles.nextLevel}>
          {stats.xpToNext} XP to Level {stats.level + 1}
        </div>
      )}
    </div>
  );
}

