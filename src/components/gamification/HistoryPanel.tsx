/**
 * History Panel Component
 * Displays generation history and favorites with Soulmate + Polaroid style
 */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  getHistory,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  removeFromHistory,
  clearHistory,
  isFavorite,
  formatTimestamp,
  type HistoryItem
} from '../../lib/gamification';
import { getChemistryTier } from '../../lib/generator';
import groupColors from '../../data/groupColors.json';
import styles from './HistoryPanel.module.css';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroupColor {
  color: string;
  emoji: string;
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

  // Listen for new results
  useEffect(() => {
    const handleNewResult = () => {
      if (isOpen) refreshData();
    };
    window.addEventListener('kpop-result-generated', handleNewResult);
    return () => window.removeEventListener('kpop-result-generated', handleNewResult);
  }, [isOpen]);

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

  const handleClearAll = () => {
    if (confirm('정말 모든 기록을 삭제할까요?')) {
      clearHistory();
      refreshData();
    }
  };

  const getGroupEmoji = (group: string): string => {
    const colors = groupColors as Record<string, GroupColor>;
    return colors[group]?.emoji || '⭐';
  };

  const getGroupColor = (group: string): string => {
    const colors = groupColors as Record<string, GroupColor>;
    return colors[group]?.color || '#9c6bff';
  };

  // Get #1 soulmate (highest chemistry)
  const soulmate = history.length > 0 
    ? history.reduce((max, item) => item.result.chemistry > max.result.chemistry ? item : max, history[0])
    : null;

  if (!isOpen || !mounted) return null;

  const items = activeTab === 'history' ? history : favorites;
  const soulmateTier = soulmate ? getChemistryTier(soulmate.result.chemistry) : null;

  const panelContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>💕 My Chemistry</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.scrollContent}>
          {/* Soulmate Section */}
          {soulmate && (
            <div className={styles.soulmateSection}>
              <div className={styles.soulmateLabel}>👑 MY SOULMATE</div>
              <div 
                className={styles.soulmateCard}
                style={{ 
                  '--tier-gradient': soulmateTier?.bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                } as React.CSSProperties}
              >
                <div className={styles.soulmateTier}>
                  <span className={styles.tierEmoji}>{soulmateTier?.emoji || '💜'}</span>
                  <span className={styles.tierName}>{soulmateTier?.name || 'Amazing'}</span>
                  {soulmateTier?.rarity && (
                    <span className={styles.tierRarity}>{soulmateTier.rarity}</span>
                  )}
                </div>
                <div className={styles.soulmateScore}>{soulmate.result.chemistry}%</div>
                <div className={styles.soulmateMatch}>
                  <span>{getGroupEmoji(soulmate.idol.group)} {soulmate.idol.nameEn}</span>
                  <span className={styles.matchX}>×</span>
                  <span>{soulmate.result.nameKr}</span>
                </div>
                <div className={styles.soulmateMessage}>{soulmateTier?.message || '완벽한 케미!'}</div>
                <button 
                  className={styles.shareBtn}
                  onClick={() => {
                    const text = `💜 My K-Pop Soulmate Chemistry!\n\n${soulmate.idol.nameEn} × ${soulmate.result.nameEn}\n${soulmate.result.chemistry}% ${soulmateTier?.name || ''}\n\nFind yours 👉 kpopnamegenerator.com`;
                    navigator.clipboard.writeText(text);
                    alert('Copied to clipboard! 📋');
                  }}
                >
                  📤 Share
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
                onClick={() => setActiveTab('history')}
              >
                📚 Recent ({history.length})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'favorites' ? styles.active : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                ⭐ Favorites ({favorites.length})
              </button>
            </div>
            {history.length > 0 && activeTab === 'history' && (
              <button className={styles.clearBtn} onClick={handleClearAll} title="Clear all">
                🗑️
              </button>
            )}
          </div>

          {/* Polaroid Grid */}
          <div className={styles.content}>
            {items.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>
                  {activeTab === 'history' ? '📚' : '⭐'}
                </span>
                <p>
                  {activeTab === 'history' 
                    ? 'No history yet!\nGenerate a name to start collecting ✨'
                    : 'No favorites yet!\nTap ☆ to save your best results 💕'}
                </p>
              </div>
            ) : (
              <div className={styles.polaroidGrid}>
                {items.map(item => {
                  const tier = getChemistryTier(item.result.chemistry);
                  const isFav = isFavorite(item.id);
                  const isSoulmate = soulmate && item.id === soulmate.id;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`${styles.polaroidCard} ${isSoulmate ? styles.isSoulmate : ''}`}
                    >
                      <div 
                        className={styles.polaroidInner}
                        style={{ '--card-color': getGroupColor(item.idol.group) } as React.CSSProperties}
                      >
                        <div className={styles.polaroidHeader}>
                          <span className={styles.polaroidEmoji}>{getGroupEmoji(item.idol.group)}</span>
                          <span className={styles.polaroidScore}>{item.result.chemistry}%</span>
                        </div>
                        <div className={styles.polaroidIdol}>{item.idol.nameEn}</div>
                        <div className={styles.polaroidName}>{item.result.nameKr}</div>
                        <div className={styles.polaroidTier}>{tier?.emoji} {tier?.name}</div>
                        <div className={styles.polaroidTime}>{formatTimestamp(item.timestamp)}</div>
                        <div className={styles.polaroidActions}>
                          <button 
                            className={`${styles.favBtn} ${isFav ? styles.isFav : ''}`}
                            onClick={() => handleToggleFavorite(item)}
                            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {isFav ? '⭐' : '☆'}
                          </button>
                          <button 
                            className={styles.delBtn}
                            onClick={() => 
                              activeTab === 'history' 
                                ? handleRemoveHistory(item.id) 
                                : handleRemoveFavorite(item.id)
                            }
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      {isSoulmate && (
                        <div className={styles.soulmateBadge}>👑</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(panelContent, document.body);
}
