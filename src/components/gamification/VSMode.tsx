/**
 * VS Mode Component
 * Compare chemistry scores between two idols
 */
import { useState, useEffect } from 'react';
import { generate } from '../../lib/generator';
import {
  addXP,
  XP_REWARDS,
  recordGeneration,
  checkChemistryBadges,
  checkVSBadges,
  addToHistory
} from '../../lib/gamification';
import { showNotification } from './Notification';
import styles from './VSMode.module.css';

interface Idol {
  group: string;
  name_en: string;
  name_kr: string;
  image?: string;
}

interface VSModeProps {
  idols: Idol[];
  onClose: () => void;
}

interface VSResult {
  idol: Idol;
  nameKr: string;
  nameEn: string;
  chemistry: number;
}

export default function VSMode({ idols, onClose }: VSModeProps) {
  const [myName, setMyName] = useState('');
  const [idol1, setIdol1] = useState<Idol | null>(null);
  const [idol2, setIdol2] = useState<Idol | null>(null);
  const [result1, setResult1] = useState<VSResult | null>(null);
  const [result2, setResult2] = useState<VSResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  // Group idols by group
  const groupedIdols = idols.reduce((acc, idol) => {
    if (!acc[idol.group]) acc[idol.group] = [];
    acc[idol.group].push(idol);
    return acc;
  }, {} as Record<string, Idol[]>);

  const handleGenerate = async () => {
    if (!myName.trim() || !idol1 || !idol2) return;

    setIsGenerating(true);
    setWinner(null);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate for both idols
    const res1 = generate({
      myName: myName.trim(),
      idol: idol1,
      genderPref: 'both',
      relation: 'lover'
    });

    const res2 = generate({
      myName: myName.trim(),
      idol: idol2,
      genderPref: 'both',
      relation: 'lover'
    });

    const vsResult1: VSResult = {
      idol: idol1,
      nameKr: res1.name_kr,
      nameEn: res1.name_en,
      chemistry: res1.chemistry
    };

    const vsResult2: VSResult = {
      idol: idol2,
      nameKr: res2.name_kr,
      nameEn: res2.name_en,
      chemistry: res2.chemistry
    };

    setResult1(vsResult1);
    setResult2(vsResult2);

    // Determine winner
    const winnerNum = res1.chemistry > res2.chemistry ? 1 : res1.chemistry < res2.chemistry ? 2 : null;
    setWinner(winnerNum);

    // Record stats and XP for both
    [vsResult1, vsResult2].forEach((r, i) => {
      recordGeneration(
        r.idol.name_kr,
        r.idol.group,
        'lover',
        r.chemistry,
        r.nameKr
      );

      addToHistory({
        myName: myName.trim(),
        idol: {
          group: r.idol.group,
          nameEn: r.idol.name_en,
          nameKr: r.idol.name_kr
        },
        result: {
          nameKr: r.nameKr,
          nameEn: r.nameEn,
          chemistry: r.chemistry
        },
        relation: 'lover'
      });

      // Check chemistry badges
      const badgeResult = checkChemistryBadges(r.chemistry);
      badgeResult.unlocked.forEach(badge => {
        showNotification(`🏆 Badge: ${badge.name}`, 'badge', badge.icon);
      });
    });

    // VS Mode XP
    const xpResult = addXP(XP_REWARDS.vs_battle, 'vs_battle');
    if (xpResult.leveledUp) {
      showNotification(`🎉 Level Up! Level ${xpResult.newLevel}`, 'levelup');
    }

    // Check VS badges (consider winner as the higher chemistry)
    checkVSBadges(winner === 1 || winner === 2);

    setIsGenerating(false);
  };

  const handleReset = () => {
    setIdol1(null);
    setIdol2(null);
    setResult1(null);
    setResult2(null);
    setWinner(null);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚔️ VS Mode</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {/* Name Input */}
          <div className={styles.nameInput}>
            <label>Your Name</label>
            <input
              type="text"
              value={myName}
              onChange={e => setMyName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
            />
          </div>

          {/* VS Arena */}
          <div className={styles.arena}>
            {/* Idol 1 */}
            <IdolSlot
              label="Idol 1"
              idol={idol1}
              result={result1}
              isWinner={winner === 1}
              groupedIdols={groupedIdols}
              onSelect={setIdol1}
              excludeIdol={idol2}
            />

            {/* VS Badge */}
            <div className={styles.vsBadge}>
              <span>VS</span>
            </div>

            {/* Idol 2 */}
            <IdolSlot
              label="Idol 2"
              idol={idol2}
              result={result2}
              isWinner={winner === 2}
              groupedIdols={groupedIdols}
              onSelect={setIdol2}
              excludeIdol={idol1}
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            {!result1 && !result2 ? (
              <button
                className={styles.generateBtn}
                onClick={handleGenerate}
                disabled={!myName.trim() || !idol1 || !idol2 || isGenerating}
              >
                {isGenerating ? '⏳ Generating...' : '⚡ Battle!'}
              </button>
            ) : (
              <button className={styles.resetBtn} onClick={handleReset}>
                🔄 New Battle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface IdolSlotProps {
  label: string;
  idol: Idol | null;
  result: VSResult | null;
  isWinner: boolean;
  groupedIdols: Record<string, Idol[]>;
  onSelect: (idol: Idol) => void;
  excludeIdol: Idol | null;
}

function IdolSlot({ label, idol, result, isWinner, groupedIdols, onSelect, excludeIdol }: IdolSlotProps) {
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className={`${styles.idolSlot} ${isWinner ? styles.winner : ''} ${result && !isWinner ? styles.loser : ''}`}>
      {result ? (
        // Result view
        <div className={styles.resultCard}>
          <div className={styles.idolInfo}>
            <span className={styles.groupName}>{idol?.group}</span>
            <span className={styles.idolName}>{idol?.name_kr}</span>
          </div>
          <div className={styles.chemistryScore}>
            <span className={styles.score}>{result.chemistry}%</span>
            <span className={styles.label}>Chemistry</span>
          </div>
          <div className={styles.generatedName}>
            <span className={styles.nameKr}>{result.nameKr}</span>
            <span className={styles.nameEn}>{result.nameEn}</span>
          </div>
          {isWinner && (
            <div className={styles.winnerBadge}>👑 Winner!</div>
          )}
        </div>
      ) : idol ? (
        // Selected idol view
        <div className={styles.selectedIdol} onClick={() => setShowSelector(true)}>
          <span className={styles.groupName}>{idol.group}</span>
          <span className={styles.idolName}>{idol.name_kr}</span>
          <span className={styles.tapToChange}>Tap to change</span>
        </div>
      ) : (
        // Empty slot
        <button className={styles.selectBtn} onClick={() => setShowSelector(true)}>
          <span className={styles.plus}>+</span>
          <span>{label}</span>
        </button>
      )}

      {/* Idol Selector Modal */}
      {showSelector && (
        <div className={styles.selectorOverlay} onClick={() => setShowSelector(false)}>
          <div className={styles.selector} onClick={e => e.stopPropagation()}>
            <h3>Select {label}</h3>
            <div className={styles.groupList}>
              {Object.entries(groupedIdols).map(([group, members]) => (
                <div key={group} className={styles.groupSection}>
                  <h4 className={styles.groupTitle}>{group}</h4>
                  <div className={styles.memberList}>
                    {members
                      .filter(m => !(excludeIdol && m.name_kr === excludeIdol.name_kr))
                      .map(member => (
                        <button
                          key={member.name_kr}
                          className={styles.memberBtn}
                          onClick={() => {
                            onSelect(member);
                            setShowSelector(false);
                          }}
                        >
                          {member.name_kr}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


