/**
 * Generator Form - React Component
 * Interactive form with 2-step idol selection + quick pick
 */

import { useState, useMemo, useEffect } from 'react';
import { generate, getChemistryDescription, RELATION_OPTIONS, generateDeepAnalysis, generateCoupleNames, getChemistryTier, type RelationType, type GeneratorResult, type ChemistryTier } from '@/lib/generator';
import {
  addXP,
  XP_REWARDS,
  recordGeneration,
  checkChemistryBadges,
  checkGenerationBadges,
  addToHistory,
  getLevelStats,
  trackIdolTest,
  getGroupProgress
} from '@/lib/gamification';
import { showNotification } from '@/components/gamification/Notification';
import idolsData from '@/data/idols.json';
import groupColors from '@/data/groupColors.json';
import styles from './IdolSelector.module.css';

interface Idol {
  group: string;
  name_kr: string;
  name_en: string;
  gender: 'male' | 'female';
}

interface GroupColor {
  color: string;
  emoji: string;
}

interface Props {
  initialGroup?: string;
  showAllGroups?: boolean;
}

// Popular groups to show first
const POPULAR_GROUPS = ['BTS', 'BLACKPINK', 'Stray Kids', 'TWICE', 'LE SSERAFIM', 'NewJeans', 'EXO', 'SEVENTEEN', 'TXT', 'ENHYPEN'];
const INITIAL_VISIBLE_GROUPS = 8;

// Recent idols storage key
const RECENT_IDOLS_KEY = 'kpop-recent-idols';
const MAX_RECENT_IDOLS = 5;

export default function GeneratorForm({ initialGroup, showAllGroups = true }: Props) {
  const [myName, setMyName] = useState('');
  const [selectedIdol, setSelectedIdol] = useState<Idol | null>(null);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup || '');
  const [genderPref, setGenderPref] = useState<'auto' | 'male' | 'female'>('auto');
  const [relation, setRelation] = useState<RelationType>('lover');
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variation, setVariation] = useState(0);
  const [showAllGroupsGrid, setShowAllGroupsGrid] = useState(false);
  const [recentIdols, setRecentIdols] = useState<Idol[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'boy' | 'girl'>('all');
  const [isFirstResult, setIsFirstResult] = useState(true); // For animation control
  const [groupProgress, setGroupProgress] = useState<{ tested: number; total: number; percentage: number } | null>(null);

  // Load recent idols from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_IDOLS_KEY);
      if (saved) {
        setRecentIdols(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading recent idols:', e);
    }
  }, []);

  // Listen for hero input from Astro page
  useEffect(() => {
    const savedName = localStorage.getItem('kpop-hero-name');
    if (savedName) {
      setMyName(savedName);
      localStorage.removeItem('kpop-hero-name');
    }

    const handleHeroName = (e: CustomEvent<{ name: string }>) => {
      if (e.detail?.name) {
        setMyName(e.detail.name);
      }
    };

    window.addEventListener('hero-name-submitted', handleHeroName as EventListener);
    return () => {
      window.removeEventListener('hero-name-submitted', handleHeroName as EventListener);
    };
  }, []);

  // Get idols data
  const idols = useMemo(() => {
    const data = idolsData as Idol[];
    if (initialGroup) {
      return data.filter(idol => idol.group.toLowerCase() === initialGroup.toLowerCase());
    }
    return data;
  }, [initialGroup]);

  // Get unique groups sorted by popularity
  const groups = useMemo(() => {
    const groupSet = new Set(idols.map(idol => idol.group));
    const allGroups = Array.from(groupSet);
    
    // Sort: popular groups first, then alphabetically
    return allGroups.sort((a, b) => {
      const aPopular = POPULAR_GROUPS.indexOf(a);
      const bPopular = POPULAR_GROUPS.indexOf(b);
      if (aPopular !== -1 && bPopular !== -1) return aPopular - bPopular;
      if (aPopular !== -1) return -1;
      if (bPopular !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [idols]);

  // Filter groups by category
  const filteredGroups = useMemo(() => {
    if (categoryFilter === 'all') return groups;
    
    return groups.filter(group => {
      const groupIdols = idols.filter(idol => idol.group === group);
      if (groupIdols.length === 0) return false;
      
      // Check majority gender of group
      const femaleCount = groupIdols.filter(i => i.gender === 'female').length;
      const isBoyGroup = femaleCount < groupIdols.length / 2;
      
      return categoryFilter === 'boy' ? isBoyGroup : !isBoyGroup;
    });
  }, [groups, categoryFilter, idols]);

  // Groups to display (limited or all)
  const displayedGroups = useMemo(() => {
    if (showAllGroupsGrid || !showAllGroups) return filteredGroups;
    return filteredGroups.slice(0, INITIAL_VISIBLE_GROUPS);
  }, [filteredGroups, showAllGroupsGrid, showAllGroups]);

  // Filter idols by selected group
  const filteredIdols = useMemo(() => {
    if (!selectedGroup) return idols;
    return idols.filter(idol => idol.group === selectedGroup);
  }, [idols, selectedGroup]);

  // Save idol to recent
  const saveToRecent = (idol: Idol) => {
    try {
      const updated = [idol, ...recentIdols.filter(
        i => !(i.group === idol.group && i.name_en === idol.name_en)
      )].slice(0, MAX_RECENT_IDOLS);
      setRecentIdols(updated);
      localStorage.setItem(RECENT_IDOLS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving recent idol:', e);
    }
  };

  // Handle group selection
  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group);
    setSelectedIdol(null);
  };

  // Handle idol selection
  const handleIdolSelect = (idol: Idol) => {
    setSelectedIdol(idol);
    saveToRecent(idol);
  };

  // Handle quick pick selection
  const handleQuickPick = (idol: Idol) => {
    setSelectedGroup(idol.group);
    setSelectedIdol(idol);
    saveToRecent(idol);
  };

  const handleGenerate = () => {
    if (!myName.trim() || !selectedIdol) return;

    setIsGenerating(true);
    setIsFirstResult(true); // Enable animation for first generate
    
    setTimeout(() => {
      const result = generate({
        myName: myName.trim(),
        idol: {
          group: selectedIdol.group,
          name_kr: selectedIdol.name_kr,
          name_en: selectedIdol.name_en,
          gender: selectedIdol.gender
        },
        genderPref,
        relation,
        variation
      });
      
      setResult(result);
      setIsGenerating(false);

      // Gamification integration
      try {
        recordGeneration(
          selectedIdol.name_kr,
          selectedIdol.group,
          relation,
          result.chemistry,
          result.styled.full_kr
        );

        addToHistory({
          myName: myName.trim(),
          idol: {
            group: selectedIdol.group,
            nameEn: selectedIdol.name_en,
            nameKr: selectedIdol.name_kr
          },
          result: {
            nameKr: result.styled.full_kr,
            nameEn: result.styled.full_en,
            chemistry: result.chemistry
          },
          relation
        });

        let xpType: 'generate' | 'high_chemistry' | 'perfect_chemistry' = 'generate';
        if (result.chemistry === 100) xpType = 'perfect_chemistry';
        else if (result.chemistry >= 90) xpType = 'high_chemistry';

        const xpAmount = XP_REWARDS[xpType];
        const xpResult = addXP(xpAmount, xpType);
        
        if (xpResult.leveledUp && xpResult.newLevel) {
          showNotification(`🎉 Level Up! Level ${xpResult.newLevel}`, 'levelup');
        }

        const stats = getLevelStats();
        checkGenerationBadges(stats.totalGenerations);
        
        const badgeResult = checkChemistryBadges(result.chemistry);
        badgeResult.unlocked.forEach(badge => {
          showNotification(`🏆 Badge: ${badge.name}`, 'badge', badge.icon);
        });

        // Track idol collection
        const collectionResult = trackIdolTest(selectedIdol.group, selectedIdol.name_en);
        setGroupProgress(collectionResult.groupProgress);
        
        if (collectionResult.badgeUnlocked) {
          showNotification(`🏆 ${collectionResult.badgeUnlocked.name}!`, 'badge', collectionResult.badgeUnlocked.icon);
        }

        window.dispatchEvent(new Event('levelUpdate'));
      } catch (e) {
        console.error('Gamification error:', e);
      }
    }, 300);
  };

  const handleReset = () => {
    setResult(null);
    setVariation(0);
  };

  const handleReroll = () => {
    if (!myName.trim() || !selectedIdol) return;
    
    setIsGenerating(true);
    setIsFirstResult(false); // Disable animation for re-roll
    const newVariation = (variation + 1) % 10;
    setVariation(newVariation);
    
    setTimeout(() => {
      const result = generate({
        myName: myName.trim(),
        idol: {
          group: selectedIdol.group,
          name_kr: selectedIdol.name_kr,
          name_en: selectedIdol.name_en,
          gender: selectedIdol.gender
        },
        genderPref,
        relation,
        variation: newVariation
      });
      
      setResult(result);
      setIsGenerating(false);
    }, 200);
  };

  const chemistryInfo = result ? getChemistryDescription(result.chemistry) : null;
  const chemistryTier = result ? getChemistryTier(result.chemistry) : null;
  const colors = groupColors as Record<string, GroupColor>;
  
  // Generate analysis and couple names when result exists
  // Pass variation so each re-roll produces different rankings
  const deepAnalysis = result && selectedIdol 
    ? generateDeepAnalysis(myName, selectedIdol.name_en, selectedIdol.group, result.chemistry, variation)
    : null;
  const coupleNames = result && selectedIdol
    ? generateCoupleNames(myName, selectedIdol.name_en, selectedIdol.name_kr, result.chemistry)
    : null;

  return (
    <div className="generator-form">
      {!result ? (
        <div className="form-container">
          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name-input">Your Name</label>
            <input
              id="name-input"
              type="text"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              placeholder="Enter your name..."
              autoComplete="off"
            />
          </div>

          {/* Quick Pick - Recent Idols */}
          {recentIdols.length > 0 && showAllGroups && (
            <div className={styles.quickPick}>
              <div className={styles.quickPickHeader}>
                <span>📍</span> Quick Pick
              </div>
              <div className={styles.quickPickItems}>
                {recentIdols.map((idol) => (
                  <button
                    key={`${idol.group}:${idol.name_en}`}
                    className={`${styles.quickPickItem} ${
                      selectedIdol?.name_en === idol.name_en && selectedIdol?.group === idol.group ? styles.selected : ''
                    }`}
                    onClick={() => handleQuickPick(idol)}
                  >
                    <span>{idol.name_en}</span>
                    <span className={styles.group}>{idol.group}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Group Selection */}
          {showAllGroups && groups.length > 1 && (
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <span className={`${styles.stepNumber} ${selectedGroup ? styles.stepComplete : ''}`}>
                  {selectedGroup ? '✓' : '1'}
                </span>
                <span className={styles.stepTitle}>
                  {selectedGroup ? `Group: ${selectedGroup}` : 'Select Group'}
                </span>
                {selectedGroup && (
                  <button 
                    className="btn-text" 
                    onClick={() => { setSelectedGroup(''); setSelectedIdol(null); }}
                    style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--accent)' }}
                  >
                    Change
                  </button>
                )}
              </div>

              {!selectedGroup && (
                <>
                  {/* Category Filter */}
                  <div className={styles.categoryFilter}>
                    <button 
                      className={`${styles.categoryButton} ${categoryFilter === 'all' ? styles.active : ''}`}
                      onClick={() => setCategoryFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`${styles.categoryButton} ${categoryFilter === 'boy' ? styles.active : ''}`}
                      onClick={() => setCategoryFilter('boy')}
                    >
                      👦 Boy Groups
                    </button>
                    <button 
                      className={`${styles.categoryButton} ${categoryFilter === 'girl' ? styles.active : ''}`}
                      onClick={() => setCategoryFilter('girl')}
                    >
                      👧 Girl Groups
                    </button>
                  </div>

                  {/* Group Grid */}
                  <div className={styles.groupGrid}>
                    {displayedGroups.map((group) => {
                      const groupColor = colors[group] || { color: '#888', emoji: '🎤' };
                      return (
                        <button
                          key={group}
                          className={`${styles.groupCard} ${selectedGroup === group ? styles.selected : ''}`}
                          style={{ '--group-color': groupColor.color } as React.CSSProperties}
                          onClick={() => handleGroupSelect(group)}
                        >
                          <span className={styles.groupEmoji}>{groupColor.emoji}</span>
                          <span className={styles.groupName}>{group}</span>
                        </button>
                      );
                    })}
                    
                    {/* More Button */}
                    {!showAllGroupsGrid && filteredGroups.length > INITIAL_VISIBLE_GROUPS && (
                      <button 
                        className={styles.moreButton}
                        onClick={() => setShowAllGroupsGrid(true)}
                      >
                        <span>+{filteredGroups.length - INITIAL_VISIBLE_GROUPS}</span>
                        <span style={{ fontSize: '0.7rem' }}>More</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Member Selection */}
          {(selectedGroup || !showAllGroups) && (
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <span className={`${styles.stepNumber} ${selectedIdol ? styles.stepComplete : ''}`}>
                  {selectedIdol ? '✓' : showAllGroups ? '2' : '1'}
                </span>
                <span className={styles.stepTitle}>
                  {selectedIdol ? `Idol: ${selectedIdol.name_en}` : 'Select Idol'}
                </span>
              </div>

              {!selectedIdol ? (
                <div className={styles.memberGrid}>
                  {filteredIdols.map((idol) => (
                    <button
                      key={`${idol.group}:${idol.name_en}`}
                      className={styles.memberButton}
                      onClick={() => handleIdolSelect(idol)}
                    >
                      <span className={styles.memberNameEn}>{idol.name_en}</span>
                      <span className={styles.memberNameKr}>{idol.name_kr}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.memberGrid}>
                  {filteredIdols.map((idol) => (
                    <button
                      key={`${idol.group}:${idol.name_en}`}
                      className={`${styles.memberButton} ${
                        selectedIdol.name_en === idol.name_en ? styles.selected : ''
                      }`}
                      onClick={() => handleIdolSelect(idol)}
                    >
                      <span className={styles.memberNameEn}>{idol.name_en}</span>
                      <span className={styles.memberNameKr}>{idol.name_kr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gender Preference */}
          <div className="form-group">
            <label>Generated Name Gender</label>
            <div className="radio-group">
              {[
                { value: 'auto', label: '🔄 Auto' },
                { value: 'female', label: '👩 Female' },
                { value: 'male', label: '👨 Male' }
              ].map(opt => (
                <label key={opt.value} className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value={opt.value}
                    checked={genderPref === opt.value}
                    onChange={(e) => setGenderPref(e.target.value as typeof genderPref)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Relation Type */}
          <div className="form-group">
            <label htmlFor="relation-select">Relationship Type</label>
            <select
              id="relation-select"
              value={relation}
              onChange={(e) => setRelation(e.target.value as RelationType)}
            >
              {RELATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.emoji} {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            className="btn primary generate-btn"
            onClick={handleGenerate}
            disabled={!myName.trim() || !selectedIdol || isGenerating}
          >
            {isGenerating ? '✨ Generating...' : '✨ Generate Name'}
          </button>
        </div>
      ) : (
        // Result Display
        <div className="result-container">
          {/* Header with Chemistry Tier */}
          <div 
            className={`result-header tier-${chemistryTier?.name.toLowerCase()}`}
            style={{ '--tier-gradient': chemistryTier?.bgGradient } as React.CSSProperties}
          >
            <div className="tier-badge">
              <span className="tier-emoji">{chemistryTier?.emoji}</span>
              <span className="tier-name">{chemistryTier?.name}</span>
              {chemistryTier?.rarity && (
                <span className="tier-rarity">{chemistryTier.rarity}</span>
              )}
            </div>
            <div className="chemistry-score" style={{ color: chemistryTier?.color }}>
              {result.chemistry}%
            </div>
            <span className="chemistry-message">{chemistryTier?.message}</span>
            <p className="result-subtitle">
              {myName} 💕 {selectedIdol?.name_en} ({selectedIdol?.group})
            </p>
          </div>

          {/* All-in-One Content (No Tabs) */}
          <div className={`all-in-one-content ${isFirstResult ? 'animate' : ''}`}>
            {/* Section 1: Names */}
            <div className={`section-card section-name ${isFirstResult ? 'fade-in' : ''}`} style={{ animationDelay: isFirstResult ? '0s' : '0s' }}>
              <div className="section-header">📝 Your K-Pop Names</div>
              <div className="result-names">
                <div className="result-card">
                  <span className="result-label">Your K-Pop Name</span>
                  <span className="result-name-kr">{result.styled.full_kr}</span>
                  <span className="result-name-en">{result.styled.full_en}</span>
                </div>

                <div className="result-card secondary">
                  <span className="result-label">Same Name as {selectedIdol?.name_en}</span>
                  <span className="result-name-kr">{result.sameName.full_kr}</span>
                  <span className="result-name-en">{result.sameName.full_en}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Analysis */}
            {deepAnalysis && (
              <div className={`section-card section-analysis ${isFirstResult ? 'fade-in' : ''}`} style={{ animationDelay: isFirstResult ? '0.15s' : '0s' }}>
                <div className="section-header">💜 Chemistry Analysis</div>
                
                <div className="analysis-categories">
                  {deepAnalysis.categories.map((cat, idx) => (
                    <div key={idx} className="analysis-category">
                      <div className="category-header">
                        <span>{cat.emoji} {cat.name}</span>
                        <span className="category-score">{cat.score}%</span>
                      </div>
                      <div className="category-bar">
                        <div 
                          className="category-fill" 
                          style={{ 
                            width: `${cat.score}%`,
                            transition: isFirstResult ? 'width 0.6s ease-out' : 'width 0.15s ease-out',
                            transitionDelay: isFirstResult ? `${0.3 + idx * 0.1}s` : '0s'
                          }}
                        />
                      </div>
                      <div className="category-desc">{cat.description}</div>
                    </div>
                  ))}
                </div>

                <div className="analysis-extras compact">
                  <span>🎨 {deepAnalysis.luckyColor}</span>
                  <span>🔢 Lucky {deepAnalysis.luckyNumber}</span>
                  <span>🎵 {deepAnalysis.recommendedSong}</span>
                </div>
              </div>
            )}

            {/* Section 3: Ship Names */}
            {coupleNames && (
              <div className={`section-card section-ship ${isFirstResult ? 'fade-in' : ''}`} style={{ animationDelay: isFirstResult ? '0.3s' : '0s' }}>
                <div className="section-header">💑 Your Ship Names</div>

                {/* Ship Motto - Highlighted */}
                <div className="ship-motto">
                  <span className="motto-text">"{coupleNames.shipMotto}"</span>
                </div>

                <div className="ship-names-grid">
                  <div className="ship-item cute">
                    <span className="ship-label">🎀 Cute</span>
                    <span className="ship-value">{coupleNames.cute}</span>
                  </div>
                  <div className="ship-item chaos">
                    <span className="ship-label">🔥 Chaos</span>
                    <span className="ship-value">{coupleNames.chaos}</span>
                  </div>
                  <div className="ship-item highlight">
                    <span className="ship-label">📱 Insta Bio</span>
                    <span className="ship-value">{coupleNames.instaBio}</span>
                  </div>
                  <div className="ship-item">
                    <span className="ship-label"># Hashtag</span>
                    <span className="ship-value">{coupleNames.hashtag}</span>
                  </div>
                  <div className="ship-item">
                    <span className="ship-label">🇰🇷 Korean</span>
                    <span className="ship-value">{coupleNames.korean}</span>
                  </div>
                  <div className="ship-item">
                    <span className="ship-label">📖 Fanfic</span>
                    <span className="ship-value">{coupleNames.fanficName}</span>
                  </div>
                </div>

                <button 
                  className="btn-compact copy-ships-btn"
                  onClick={() => {
                    const allNames = `✨ ${coupleNames.shipMotto}\n\n🎀 ${coupleNames.cute}\n🔥 ${coupleNames.chaos}\n📱 ${coupleNames.instaBio}\n${coupleNames.hashtag}`;
                    navigator.clipboard.writeText(allNames);
                    showNotification('All ship names copied! 💕', 'success', '📋');
                  }}
                >
                  📋 Copy All Ship Names
                </button>
              </div>
            )}
          </div>

          {/* Other Members Teaser with Collection Progress */}
          {selectedIdol && (
            <div className={`other-members-section ${isFirstResult ? 'fade-in' : ''}`} style={{ animationDelay: isFirstResult ? '0.45s' : '0s' }}>
              {/* Collection Progress Bar */}
              {groupProgress && (
                <div className="collection-progress">
                  <div className="collection-header">
                    <span className="collection-title">🏆 {selectedIdol.group} Master</span>
                    <span className="collection-count">{groupProgress.tested}/{groupProgress.total}</span>
                  </div>
                  <div className="collection-bar">
                    <div 
                      className="collection-fill" 
                      style={{ width: `${groupProgress.percentage}%` }}
                    />
                  </div>
                  {groupProgress.percentage >= 100 ? (
                    <span className="collection-complete">✨ Complete! You're a {selectedIdol.group} Master!</span>
                  ) : (
                    <span className="collection-hint">Test {groupProgress.total - groupProgress.tested} more to unlock badge!</span>
                  )}
                </div>
              )}

              <div className="other-members-header">
                <span>🤔</span> What about other members?
              </div>
              <div className="other-members-grid">
                {idols
                  .filter(idol => idol.group === selectedIdol.group && idol.name_en !== selectedIdol.name_en)
                  .slice(0, 4)
                  .map((idol) => (
                    <button
                      key={idol.name_en}
                      className="other-member-card"
                      onClick={() => {
                        handleIdolSelect(idol);
                        setIsFirstResult(false);
                        setTimeout(() => handleGenerate(), 100);
                      }}
                    >
                      <span className="other-member-name">{idol.name_en}</span>
                      <span className="other-member-chemistry">??%</span>
                      <span className="other-member-lock">🔒</span>
                    </button>
                  ))}
              </div>
              <button 
                className="try-all-btn"
                onClick={() => {
                  setResult(null);
                }}
              >
                ✨ Try All Members
              </button>
            </div>
          )}

          {/* Sticky Bottom Action Bar */}
          <div className="sticky-action-bar">
            <button className="action-btn secondary" onClick={handleReset}>
              ← New
            </button>
            <div className="action-bar-info">
              <span className="action-bar-name">{result.styled.full_kr}</span>
              <span className="action-bar-chemistry">{result.chemistry}%</span>
            </div>
            <button 
              className="action-btn reroll" 
              onClick={handleReroll}
              disabled={isGenerating}
            >
              🎲 Re-roll
            </button>
          </div>
          
          {/* Share Buttons */}
          <div className="share-section">
            <span className="share-label">✨ Flex your K-Pop soulmate! ✨</span>
            <div className="share-buttons">
              <button 
                className="share-btn native-share"
                onClick={async () => {
                  const shareData = {
                    title: `My K-Pop Chemistry with ${selectedIdol?.name_en}`,
                    text: `OMG! I got ${result.chemistry}% chemistry with ${selectedIdol?.name_en}! 💜 My K-Pop name is ${result.styled.full_kr} ✨ Can you beat my score?`,
                    url: 'https://kpopnamegenerator.com'
                  };
                  
                  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                    try {
                      await navigator.share(shareData);
                      import('@/lib/gamification').then(({ checkShareBadges }) => checkShareBadges());
                    } catch (err) {
                      if ((err as Error).name !== 'AbortError') {
                        console.log('Share failed:', err);
                      }
                    }
                  } else {
                    const text = `OMG! I got ${result.chemistry}% chemistry with ${selectedIdol?.name_en}! 💜 My K-Pop name is ${result.styled.full_kr} ✨\n\n🔗 kpopnamegenerator.com`;
                    navigator.clipboard.writeText(text);
                    showNotification('Copied to clipboard!', 'success', '📋');
                    import('@/lib/gamification').then(({ checkShareBadges }) => checkShareBadges());
                  }
                }}
                title="Share"
              >
                📤
              </button>
              <button 
                className="share-btn tiktok"
                onClick={() => {
                  const text = `OMG I got ${result.chemistry}% chemistry with ${selectedIdol?.name_en}! 💜 My K-Pop name is ${result.styled.full_kr} ✨ Can you beat my score?\n\n🔗 kpopnamegenerator.com`;
                  navigator.clipboard.writeText(text);
                  showNotification('Copied! Paste in TikTok 🎵', 'success', '🎵');
                  import('@/lib/gamification').then(({ checkShareBadges }) => checkShareBadges());
                }}
                title="Copy for TikTok"
              >
                <span className="tiktok-icon">♪</span>
              </button>
              <button 
                className="share-btn instagram"
                onClick={() => {
                  const text = `${result.chemistry}% chemistry with ${selectedIdol?.name_en}?! 😱💜\n\nMy K-Pop name: ${result.styled.full_kr}\n\n✨ Get yours: kpopnamegenerator.com\n\n#kpop #${selectedIdol?.group.replace(/\s+/g, '')} #kpopnamegenerator #fyp`;
                  navigator.clipboard.writeText(text);
                  showNotification('Copied! Share to Story 📸', 'success', '📸');
                  import('@/lib/gamification').then(({ checkShareBadges }) => checkShareBadges());
                }}
                title="Copy for Instagram"
              >
                📸
              </button>
              <button 
                className="share-btn twitter"
                onClick={() => {
                  const text = `I got ${result.chemistry}% chemistry with ${selectedIdol?.name_en}! 💜✨ My K-Pop name is ${result.styled.full_kr}\n\nFind your idol soulmate 👇`;
                  const url = 'https://kpopnamegenerator.com';
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                  import('@/lib/gamification').then(({ checkShareBadges }) => checkShareBadges());
                }}
                title="Share on X"
              >
                𝕏
              </button>
              <button 
                className="share-btn discord"
                onClick={() => {
                  const text = `**My K-Pop Chemistry Result** 💜\n\n🎤 Idol: ${selectedIdol?.name_en} (${selectedIdol?.group})\n💕 Chemistry: **${result.chemistry}%** ${chemistryInfo?.emoji}\n✨ My Name: ${result.styled.full_kr} (${result.styled.full_en})\n\nGet yours → <https://kpopnamegenerator.com>`;
                  navigator.clipboard.writeText(text);
                  showNotification('Copied for Discord! 🎮', 'success', '🎮');
                  import('@/lib/gamification').then(({ checkShareBadges }) => checkShareBadges());
                }}
                title="Copy for Discord"
              >
                🎮
              </button>
            </div>
            <p className="share-challenge">Tag your friends & compare scores! 🏆</p>
          </div>
        </div>
      )}

      <style>{`
        .generator-form {
          width: 100%;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
        }

        .radio-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .radio-label input {
          width: auto;
        }

        .btn-text {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .generate-btn {
          margin-top: 8px;
          padding: 14px 24px;
          font-size: 1.1rem;
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Result Styles */
        .result-container {
          text-align: center;
        }

        .result-header {
          margin-bottom: 24px;
        }

        /* Tier Badge */
        .tier-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .tier-emoji {
          font-size: 2rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .tier-name {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .tier-rarity {
          font-size: 0.75rem;
          background: rgba(255,255,255,0.9);
          color: #333;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 700;
        }

        .result-header.tier-mythical .tier-badge {
          animation: rainbow 3s linear infinite;
        }

        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        .result-header.tier-legendary .tier-emoji,
        .result-header.tier-mythical .tier-emoji {
          animation: pulse 1s infinite, glow 1.5s infinite alternate;
        }

        @keyframes glow {
          from { filter: drop-shadow(0 0 5px currentColor); }
          to { filter: drop-shadow(0 0 15px currentColor); }
        }

        .chemistry-score {
          font-size: 3.5rem;
          font-weight: 800;
          font-family: var(--font-heading);
          margin: 8px 0;
        }

        .chemistry-message {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
        }

        .result-names {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 24px 0;
        }

        .result-card {
          background: linear-gradient(135deg, var(--bg-t1), var(--bg-t2));
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .result-card.secondary {
          background: var(--chip);
        }

        .result-label {
          font-size: 0.8rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .result-name-kr {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text);
        }

        .result-name-en {
          font-size: 1.1rem;
          color: var(--muted);
        }

        .result-info {
          margin: 16px 0;
          color: var(--muted);
        }

        .result-info p {
          margin: 4px 0;
        }

        .relation-text {
          font-size: 0.9rem;
        }

        /* Other Members Teaser */
        .other-members-section {
          margin-top: 20px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.08));
          border-radius: 16px;
          border: 1px dashed var(--accent, #9c6bff);
        }

        /* Collection Progress */
        .collection-progress {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }

        .collection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .collection-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text);
        }

        .collection-count {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent);
        }

        .collection-bar {
          height: 8px;
          background: var(--bg-secondary, rgba(255, 255, 255, 0.5));
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .collection-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent, #9c6bff), #ec4899);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .collection-hint {
          font-size: 0.8rem;
          color: var(--muted);
        }

        .collection-complete {
          font-size: 0.85rem;
          font-weight: 600;
          color: #10B981;
        }

        .other-members-header {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .other-members-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .other-member-card {
          background: var(--surface, #fff);
          border: 1px solid var(--border, #e5e5e5);
          border-radius: 12px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .other-member-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(156, 107, 255, 0.2);
        }

        .other-member-card:hover .other-member-lock {
          transform: scale(1.2);
        }

        .other-member-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text);
          text-align: center;
        }

        .other-member-chemistry {
          font-size: 1rem;
          font-weight: 700;
          color: var(--muted);
          filter: blur(4px);
        }

        .other-member-lock {
          font-size: 0.8rem;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease;
        }

        .try-all-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, var(--accent, #9c6bff), #ec4899);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .try-all-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(156, 107, 255, 0.4);
        }

        @media (max-width: 480px) {
          .other-members-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Sticky Bottom Action Bar */
        .sticky-action-bar {
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          background: var(--surface-glass, rgba(255, 255, 255, 0.95));
          backdrop-filter: blur(10px);
          border-top: 1px solid var(--border, #e5e5e5);
          border-radius: 0 0 20px 20px;
          margin: 20px -24px -24px -24px;
          z-index: 10;
        }

        .action-btn {
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .action-btn.secondary {
          background: var(--bg-secondary, #f0f0f0);
          color: var(--text);
        }

        .action-btn.secondary:hover {
          background: var(--border, #e0e0e0);
        }

        .action-btn.reroll {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .action-btn.reroll:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .action-btn.reroll:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .action-bar-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .action-bar-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }

        .action-bar-chemistry {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 600;
        }

        .btn.reroll {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn.reroll:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn.reroll:disabled {
          opacity: 0.6;
          transform: none;
        }

        /* Share Section */
        .share-section {
          text-align: center;
          padding-top: 20px;
          margin-top: 8px;
          border-top: 1px solid var(--border, #e5e5e5);
        }

        .share-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text, #333);
          margin-bottom: 16px;
        }

        .share-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .share-btn {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-size: 1.3rem;
          font-weight: bold;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .share-btn:hover {
          transform: scale(1.1) translateY(-2px);
        }

        .share-btn:active {
          transform: scale(0.95);
        }

        .share-btn.tiktok {
          background: linear-gradient(135deg, #00f2ea, #ff0050);
          color: #fff;
        }

        .share-btn.tiktok:hover {
          box-shadow: 0 6px 20px rgba(255, 0, 80, 0.4);
        }

        .tiktok-icon {
          font-family: sans-serif;
          text-shadow: -1px -1px 0 #00f2ea, 1px 1px 0 #ff0050;
        }

        .share-btn.instagram {
          background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
          color: #fff;
        }

        .share-btn.instagram:hover {
          box-shadow: 0 6px 20px rgba(253, 29, 29, 0.4);
        }

        .share-btn.twitter {
          background: #000;
          color: #fff;
        }

        .share-btn.twitter:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .share-btn.discord {
          background: #5865F2;
          color: #fff;
        }

        .share-btn.discord:hover {
          box-shadow: 0 6px 20px rgba(88, 101, 242, 0.4);
        }

        .share-btn.native-share {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
        }

        .share-btn.native-share:hover {
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .share-btn.native-share {
            order: -1;
            width: 100%;
            border-radius: 12px;
            height: 48px;
            margin-bottom: 8px;
          }
          
          .share-btn.native-share::after {
            content: ' Share';
            font-weight: 600;
            margin-left: 8px;
          }
        }

        .share-challenge {
          margin-top: 16px;
          font-size: 0.85rem;
          color: var(--muted, #888);
          font-style: italic;
        }

        @media (max-width: 480px) {
          .radio-group {
            flex-direction: column;
            gap: 8px;
          }

          .sticky-action-bar {
            padding: 10px 12px;
            margin: 16px -16px -16px -16px;
          }

          .action-btn {
            padding: 8px 12px;
            font-size: 0.8rem;
          }

          .action-bar-name {
            font-size: 0.8rem;
          }

          .share-buttons {
            gap: 8px;
          }

          .share-btn {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
          }
        }

        /* Result Subtitle */
        .result-subtitle {
          font-size: 0.9rem;
          color: var(--muted);
          margin-top: 8px;
        }

        /* All-in-One Content */
        .all-in-one-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .section-card {
          background: var(--bg-secondary, #f9f9f9);
          border-radius: 16px;
          padding: 16px;
          opacity: 1;
        }

        .section-card.fade-in {
          animation: slideUp 0.4s ease-out both;
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .section-header {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--border, #e5e5e5);
        }

        /* Ship Motto */
        .ship-motto {
          background: linear-gradient(135deg, rgba(156, 107, 255, 0.15), rgba(255, 107, 156, 0.15));
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 16px;
        }

        .motto-text {
          font-size: 1rem;
          font-style: italic;
          color: var(--text);
          font-weight: 500;
        }

        /* Ship Names Grid */
        .ship-names-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .ship-item {
          background: var(--surface, #fff);
          padding: 10px 12px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: transform 0.2s ease;
        }

        .ship-item:hover {
          transform: scale(1.02);
        }

        .ship-item.cute {
          background: linear-gradient(135deg, #FECDD3, #FDF2F8);
        }

        .ship-item.chaos {
          background: linear-gradient(135deg, #FED7AA, #FEF3C7);
        }

        .ship-item.highlight {
          background: linear-gradient(135deg, rgba(156, 107, 255, 0.2), rgba(255, 107, 156, 0.2));
          grid-column: span 2;
        }

        .ship-label {
          font-size: 0.7rem;
          color: var(--muted);
          font-weight: 600;
        }

        .ship-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
          word-break: break-all;
        }

        .btn-compact {
          width: 100%;
          padding: 10px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .btn-compact:hover {
          background: var(--accent-dark, #8b5cf6);
          transform: scale(1.02);
        }

        .btn-compact:active {
          transform: scale(0.98);
        }

        /* Analysis Extras Compact */
        .analysis-extras.compact {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border, #e5e5e5);
        }

        .analysis-extras.compact span {
          font-size: 0.8rem;
          background: var(--surface, #fff);
          padding: 6px 12px;
          border-radius: 20px;
          color: var(--text);
        }

        /* Analysis Panel */
        .analysis-panel {
          text-align: left;
        }

        .analysis-title {
          font-size: 1.1rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 20px;
          color: var(--text);
        }

        .analysis-categories {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .analysis-category {
          background: var(--bg-secondary, #f9f9f9);
          padding: 12px 16px;
          border-radius: 12px;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .category-score {
          color: var(--accent);
          font-weight: 700;
        }

        .category-bar {
          height: 8px;
          background: var(--border, #e5e5e5);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .category-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-2, #ff6b9d));
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .category-desc {
          font-size: 0.8rem;
          color: var(--muted);
        }

        .destiny-message {
          background: linear-gradient(135deg, rgba(156, 107, 255, 0.1), rgba(255, 107, 156, 0.1));
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 20px;
        }

        .destiny-icon {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 8px;
        }

        .destiny-message p {
          font-size: 0.95rem;
          color: var(--text);
          margin: 0;
          line-height: 1.5;
        }

        .analysis-extras {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .extra-item {
          background: var(--surface, #fff);
          padding: 12px;
          border-radius: 10px;
          text-align: center;
          border: 1px solid var(--border, #e5e5e5);
        }

        .extra-label {
          display: block;
          font-size: 0.7rem;
          color: var(--muted);
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .extra-value {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
        }

        /* Couple Panel */
        .couple-panel {
          text-align: center;
        }

        .couple-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text);
        }

        .couple-names {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .couple-card {
          background: var(--bg-secondary, #f9f9f9);
          padding: 14px;
          border-radius: 12px;
          position: relative;
          text-align: left;
        }

        .couple-card.highlight {
          background: linear-gradient(135deg, rgba(156, 107, 255, 0.15), rgba(255, 107, 156, 0.15));
          border: 1px solid var(--accent);
        }

        .couple-label {
          display: block;
          font-size: 0.7rem;
          color: var(--muted);
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .couple-value {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text);
          word-break: break-all;
        }

        .copy-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--surface, #fff);
          border: 1px solid var(--border, #e5e5e5);
          border-radius: 6px;
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: var(--accent-light, #fff0f5);
          border-color: var(--accent);
        }

        .copy-all-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--accent), var(--accent-2, #ff6b9d));
          color: white;
          border: none;
          padding: 12px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        @media (max-width: 480px) {
          .analysis-extras {
            grid-template-columns: 1fr;
          }

          .couple-names {
            grid-template-columns: 1fr;
          }

          .ship-names-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
