/**
 * History Panel Component
 * Displays generation history and favorites
 */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  getHistory,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  removeFromHistory,
  isFavorite,
  formatTimestamp,
  type HistoryItem
} from '../../lib/gamification';
import styles from './HistoryPanel.module.css';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'history' | 'favorites';

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const refreshData = () => {
    setHistory(getHistory());
    setFavorites(getFavorites());
  };

  const handleToggleFavorite = (item: HistoryItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
    refreshData();
  };

  const handleRemoveHistory = (id: string) => {
    removeFromHistory(id);
    refreshData();
  };

  const handleRemoveFavorite = (id: string) => {
    removeFromFavorites(id);
    refreshData();
  };

  if (!isOpen || !mounted) return null;

  const items = activeTab === 'history' ? history : favorites;

  const panelContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>📜 History</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Recent ({history.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            ⭐ Favorites ({favorites.length})
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              {activeTab === 'history' 
                ? 'No history yet. Generate a name to get started! ✨'
                : 'No favorites yet. Tap the heart to save results! 💕'}
            </div>
          ) : (
            <div className={styles.list}>
              {items.map(item => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  isFav={isFavorite(item.id)}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                  onRemove={() => 
                    activeTab === 'history' 
                      ? handleRemoveHistory(item.id) 
                      : handleRemoveFavorite(item.id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(panelContent, document.body);
}

interface HistoryCardProps {
  item: HistoryItem;
  isFav: boolean;
  onToggleFavorite: () => void;
  onRemove: () => void;
}

function HistoryCard({ item, isFav, onToggleFavorite, onRemove }: HistoryCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.group}>{item.idol.group}</span>
        <span className={styles.time}>{formatTimestamp(item.timestamp)}</span>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.names}>
          <span className={styles.myName}>{item.myName}</span>
          <span className={styles.arrow}>→</span>
          <span className={styles.resultName}>{item.result.nameKr}</span>
        </div>
        <div className={styles.idol}>
          with <strong>{item.idol.nameKr}</strong>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div 
          className={styles.chemistry}
          style={{
            color: item.result.chemistry >= 90 
              ? '#FF4081' 
              : item.result.chemistry >= 70 
                ? '#4CAF50' 
                : '#9E9E9E'
          }}
        >
          💕 {item.result.chemistry}%
        </div>
        <div className={styles.actions}>
          <button 
            className={`${styles.actionBtn} ${isFav ? styles.favorited : ''}`}
            onClick={onToggleFavorite}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <button 
            className={styles.actionBtn}
            onClick={onRemove}
            title="Remove"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
