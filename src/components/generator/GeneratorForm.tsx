/**
 * Generator Form - React Component
 * Interactive form for generating K-Pop idol chemistry names
 */

import { useState, useMemo } from 'react';
import { generate, getChemistryDescription, RELATION_OPTIONS, type RelationType, type GeneratorResult } from '@/lib/generator';
import {
  addXP,
  XP_REWARDS,
  recordGeneration,
  checkChemistryBadges,
  checkGenerationBadges,
  addToHistory,
  getLevelStats
} from '@/lib/gamification';
import { showNotification } from '@/components/gamification/Notification';
import idolsData from '@/data/idols.json';

interface Idol {
  group: string;
  name_kr: string;
  name_en: string;
  gender: 'male' | 'female';
}

interface Props {
  initialGroup?: string;
  showAllGroups?: boolean;
}

export default function GeneratorForm({ initialGroup, showAllGroups = true }: Props) {
  const [myName, setMyName] = useState('');
  const [selectedIdol, setSelectedIdol] = useState<Idol | null>(null);
  const [genderPref, setGenderPref] = useState<'auto' | 'male' | 'female'>('auto');
  const [relation, setRelation] = useState<RelationType>('lover');
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get idols data
  const idols = useMemo(() => {
    const data = idolsData as Idol[];
    if (initialGroup) {
      return data.filter(idol => idol.group.toLowerCase() === initialGroup.toLowerCase());
    }
    return data;
  }, [initialGroup]);

  // Get unique groups
  const groups = useMemo(() => {
    const groupSet = new Set(idols.map(idol => idol.group));
    return Array.from(groupSet);
  }, [idols]);

  // Filter idols by selected group
  const [selectedGroup, setSelectedGroup] = useState(initialGroup || '');
  
  const filteredIdols = useMemo(() => {
    if (!selectedGroup) return idols;
    return idols.filter(idol => idol.group === selectedGroup);
  }, [idols, selectedGroup]);

  const handleGenerate = () => {
    if (!myName.trim() || !selectedIdol) return;

    setIsGenerating(true);
    
    // Small delay for animation effect
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
        relation
      });
      
      setResult(result);
      setIsGenerating(false);

      // Gamification integration
      try {
        // Record stats
        recordGeneration(
          selectedIdol.name_kr,
          selectedIdol.group,
          relation,
          result.chemistry,
          result.styled.full_kr
        );

        // Add to history
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

        // Determine XP type based on chemistry
        let xpType: 'generate' | 'high_chemistry' | 'perfect_chemistry' = 'generate';
        if (result.chemistry === 100) xpType = 'perfect_chemistry';
        else if (result.chemistry >= 90) xpType = 'high_chemistry';

        // Add XP
        const xpAmount = XP_REWARDS[xpType];
        const xpResult = addXP(xpAmount, xpType);
        
        if (xpResult.leveledUp && xpResult.newLevel) {
          showNotification(`🎉 Level Up! Level ${xpResult.newLevel}`, 'levelup');
        }

        // Check badges
        const stats = getLevelStats();
        checkGenerationBadges(stats.totalGenerations);
        
        const badgeResult = checkChemistryBadges(result.chemistry);
        badgeResult.unlocked.forEach(badge => {
          showNotification(`🏆 Badge: ${badge.name}`, 'badge', badge.icon);
        });

        // Dispatch level update event for UI refresh
        window.dispatchEvent(new Event('levelUpdate'));
      } catch (e) {
        console.error('Gamification error:', e);
      }
    }, 300);
  };

  const handleReset = () => {
    setResult(null);
  };

  const chemistryInfo = result ? getChemistryDescription(result.chemistry) : null;

  return (
    <div className="generator-form">
      {!result ? (
        // Input Form
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

          {/* Group Selection (if showing all groups) */}
          {showAllGroups && groups.length > 1 && (
            <div className="form-group">
              <label htmlFor="group-select">Select Group</label>
              <select
                id="group-select"
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setSelectedIdol(null);
                }}
              >
                <option value="">All Groups</option>
                {groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          )}

          {/* Idol Selection */}
          <div className="form-group">
            <label htmlFor="idol-select">Select Idol</label>
            <select
              id="idol-select"
              value={selectedIdol ? `${selectedIdol.group}:${selectedIdol.name_en}` : ''}
              onChange={(e) => {
                const [group, name] = e.target.value.split(':');
                const idol = idols.find(i => i.group === group && i.name_en === name);
                setSelectedIdol(idol || null);
              }}
            >
              <option value="">Choose an idol...</option>
              {filteredIdols.map(idol => (
                <option 
                  key={`${idol.group}:${idol.name_en}`} 
                  value={`${idol.group}:${idol.name_en}`}
                >
                  {idol.name_en} ({idol.name_kr}) - {idol.group}
                </option>
              ))}
            </select>
          </div>

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
          <div className="result-header">
            <span className="chemistry-emoji">{chemistryInfo?.emoji}</span>
            <div className="chemistry-score" style={{ color: chemistryInfo?.color }}>
              {result.chemistry}%
            </div>
            <span className="chemistry-text">{chemistryInfo?.text}</span>
          </div>

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

          <div className="result-info">
            <p>
              💕 You + <strong>{selectedIdol?.name_en}</strong> ({selectedIdol?.group})
            </p>
            <p className="relation-text">
              as {RELATION_OPTIONS.find(o => o.value === relation)?.emoji} {RELATION_OPTIONS.find(o => o.value === relation)?.label}
            </p>
          </div>

          <div className="result-actions">
            <button className="btn secondary" onClick={handleReset}>
              🔄 Try Again
            </button>
          </div>
          
          {/* Share Buttons */}
          <div className="share-section">
            <span className="share-label">✨ Flex your K-Pop soulmate! ✨</span>
            <div className="share-buttons">
              {/* Native Share Button - Primary on Mobile */}
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
                    // Fallback for desktop - copy to clipboard
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
          gap: 16px;
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

        .chemistry-emoji {
          font-size: 3rem;
          display: block;
          margin-bottom: 8px;
        }

        .chemistry-score {
          font-size: 3rem;
          font-weight: 800;
          font-family: var(--font-heading);
        }

        .chemistry-text {
          font-size: 1.2rem;
          color: var(--muted);
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

        .result-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
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

        .share-btn.imessage {
          background: linear-gradient(135deg, #34c759, #30d158);
          color: #fff;
        }

        .share-btn.imessage:hover {
          box-shadow: 0 6px 20px rgba(52, 199, 89, 0.4);
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

        /* On mobile, make native share button more prominent */
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

        /* Hide on desktop if Web Share API not available */
        @media (min-width: 769px) {
          .share-btn.native-share {
            display: flex;
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

          .result-actions {
            flex-direction: column;
          }

          .result-actions .btn {
            width: 100%;
          }

          .share-buttons {
            gap: 8px;
          }

          .share-btn {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
          }

          .share-label {
            font-size: 0.95rem;
          }

          .share-challenge {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

