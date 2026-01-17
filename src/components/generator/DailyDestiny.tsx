/**
 * Daily Destiny Component
 * Shows a random idol recommendation that changes daily
 * Encourages users to test chemistry with the "destined" idol
 */
import { useState, useEffect, useMemo } from 'react';

interface Idol {
  id: string;
  nameKr: string;
  nameEn: string;
  emoji?: string;
  group: string;
  groupSlug: string;
}

interface DailyDestinyProps {
  allIdols: Idol[];
  onSelectIdol?: (idol: Idol) => void;
}

// Seeded random number generator for consistent daily results
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get today's date as a seed
function getTodaySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

export default function DailyDestiny({ allIdols, onSelectIdol }: DailyDestinyProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if already revealed today
    const lastReveal = localStorage.getItem('dailyDestiny-lastReveal');
    const today = getTodaySeed().toString();
    if (lastReveal === today) {
      setIsRevealed(true);
    }
  }, []);

  // Get today's destined idol
  const destinyIdol = useMemo(() => {
    if (allIdols.length === 0) return null;
    const seed = getTodaySeed();
    const index = Math.floor(seededRandom(seed) * allIdols.length);
    return allIdols[index];
  }, [allIdols]);

  // Get a "lucky message" for today
  const luckyMessage = useMemo(() => {
    const messages = [
      "The stars align for you today! ✨",
      "Destiny awaits... 💫",
      "Your K-Pop soulmate for today! 💕",
      "Fate has chosen! 🌟",
      "Today's special connection! 🎯",
      "The universe has spoken! 🌙",
      "Your destined match! 💜",
      "Written in the stars! ⭐"
    ];
    const seed = getTodaySeed();
    const index = Math.floor(seededRandom(seed + 1) * messages.length);
    return messages[index];
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
    localStorage.setItem('dailyDestiny-lastReveal', getTodaySeed().toString());
  };

  const handleTestChemistry = () => {
    if (destinyIdol && onSelectIdol) {
      onSelectIdol(destinyIdol);
    }
  };

  if (!isMounted || !destinyIdol) return null;

  return (
    <div className="daily-destiny">
      <div className="destiny-header">
        <span className="destiny-icon">🔮</span>
        <h3>Today's Destiny</h3>
      </div>

      {!isRevealed ? (
        <div className="destiny-mystery">
          <div className="mystery-card" onClick={handleReveal}>
            <div className="mystery-glow"></div>
            <span className="mystery-icon">❓</span>
            <p>Tap to reveal your destined idol!</p>
          </div>
        </div>
      ) : (
        <div className="destiny-revealed">
          <p className="lucky-message">{luckyMessage}</p>
          
          <div className="destiny-idol">
            <div className="idol-avatar">
              <span className="idol-emoji">{destinyIdol.emoji || '⭐'}</span>
            </div>
            <div className="idol-info">
              <span className="idol-name">{destinyIdol.nameEn}</span>
              <span className="idol-name-kr">{destinyIdol.nameKr}</span>
              <span className="idol-group">{destinyIdol.group}</span>
            </div>
          </div>

          <button 
            className="destiny-btn"
            onClick={handleTestChemistry}
          >
            ✨ Test Chemistry with {destinyIdol.nameEn}
          </button>
          
          <p className="destiny-hint">
            New destiny awaits tomorrow! 🌅
          </p>
        </div>
      )}

      <style>{`
        .daily-destiny {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.1), 
            rgba(236, 72, 153, 0.1)
          );
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          margin-bottom: 24px;
        }

        .destiny-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .destiny-icon {
          font-size: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .destiny-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        /* Mystery State */
        .destiny-mystery {
          padding: 10px 0;
        }

        .mystery-card {
          position: relative;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 12px;
          padding: 30px 20px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          overflow: hidden;
        }

        .mystery-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3);
        }

        .mystery-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.5), transparent);
          transform: translate(-50%, -50%);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
        }

        .mystery-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
          animation: shake 2s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .mystery-card p {
          color: #fff;
          font-size: 0.9rem;
          opacity: 0.9;
          position: relative;
          z-index: 1;
          margin: 0;
        }

        /* Revealed State */
        .destiny-revealed {
          animation: reveal 0.5s ease-out;
        }

        @keyframes reveal {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .lucky-message {
          font-size: 0.85rem;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 16px;
        }

        .destiny-idol {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: var(--surface);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 16px;
        }

        .idol-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .idol-emoji {
          font-size: 2rem;
        }

        .idol-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .idol-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text);
        }

        .idol-name-kr {
          font-size: 0.9rem;
          color: var(--muted);
        }

        .idol-group {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 600;
          margin-top: 4px;
        }

        .destiny-btn {
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          width: 100%;
          max-width: 300px;
        }

        .destiny-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(139, 92, 246, 0.4);
        }

        .destiny-hint {
          font-size: 0.75rem;
          color: var(--muted);
          margin-top: 12px;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

