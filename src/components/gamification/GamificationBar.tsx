/**
 * Gamification Bar
 * Displays level badge and quick access to stats/history
 */
import { useState, useEffect } from 'react';
import { getLevelStats } from '../../lib/gamification';
import LevelBadge from './LevelBadge';
import StatsModal from './StatsModal';
import HistoryPanel from './HistoryPanel';
import styles from './GamificationBar.module.css';

export default function GamificationBar() {
  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [stats, setStats] = useState<ReturnType<typeof getLevelStats> | null>(null);

  useEffect(() => {
    setStats(getLevelStats());
    
    const handleUpdate = () => {
      setStats(getLevelStats());
    };
    
    window.addEventListener('levelUpdate', handleUpdate);
    return () => window.removeEventListener('levelUpdate', handleUpdate);
  }, []);

  if (!stats) return null;

  return (
    <>
      <div className={styles.bar}>
        <button 
          className={styles.levelBtn}
          onClick={() => setShowStats(true)}
          title="View Stats & Badges"
        >
          <span 
            className={styles.levelCircle}
            style={{ background: stats.levelColor }}
          >
            {stats.level}
          </span>
          <span className={styles.levelName}>{stats.levelName}</span>
        </button>

        <button 
          className={styles.historyBtn}
          onClick={() => setShowHistory(true)}
          title="View History"
        >
          📜
        </button>
      </div>

      {/* Modals */}
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
      <HistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
}


