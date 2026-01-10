/**
 * VS Battle Component
 * Displays head-to-head chemistry comparison
 */

import { useState, useEffect } from 'react';
import type { VSResult } from '@/lib/vs-challenge';
import { generateVSShareText } from '@/lib/vs-challenge';
import { showNotification } from '@/components/gamification/Notification';

interface Props {
  result: VSResult;
  onClose: () => void;
  onRematch: () => void;
}

export default function VSBattle({ result, onClose, onRematch }: Props) {
  const [showWinner, setShowWinner] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    // Animate scores
    const timer1 = setTimeout(() => setShowWinner(true), 1500);
    const timer2 = setTimeout(() => setAnimationDone(true), 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleShare = () => {
    const text = generateVSShareText(result);
    navigator.clipboard.writeText(text);
    showNotification('Copied! Share on SNS 📋', 'success', '📋');
  };

  const handleShareX = () => {
    const text = generateVSShareText(result);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getWinnerEmoji = () => {
    if (result.winner === 'tie') return '🤝';
    if (result.scoreDiff >= 15) return '💥';
    if (result.scoreDiff >= 10) return '🔥';
    return '✨';
  };

  const getWinnerMessage = () => {
    if (result.winner === 'tie') return "IT'S A TIE!";
    if (result.scoreDiff >= 15) return 'DESTROYED!';
    if (result.scoreDiff >= 10) return 'WINNER!';
    return 'Close call!';
  };

  return (
    <div className="vs-battle-overlay">
      <div className="vs-battle-modal">
        {/* Header */}
        <div className="vs-header">
          <span className="vs-icon">⚡</span>
          <h2>CHEMISTRY BATTLE</h2>
          <span className="vs-icon">⚡</span>
        </div>

        {/* Idol Info */}
        <div className="vs-idol-info">
          <span className="vs-idol-name">{result.idol.nameEn}</span>
          <span className="vs-idol-group">{result.idol.group}</span>
        </div>

        {/* Battle Cards */}
        <div className="vs-cards">
          {/* Challenger */}
          <div className={`vs-card ${result.winner === 'challenger' ? 'winner' : ''} ${showWinner ? 'revealed' : ''}`}>
            <div className="vs-card-label">CHALLENGER</div>
            <div className="vs-card-name">{result.challenger.name}</div>
            <div className="vs-card-score">
              <span className="vs-score-number">{result.challenger.score}</span>
              <span className="vs-score-percent">%</span>
            </div>
            <div className="vs-card-korean">{result.challenger.koreanName}</div>
            {result.winner === 'challenger' && showWinner && (
              <div className="vs-winner-badge">
                {getWinnerEmoji()} {getWinnerMessage()}
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div className="vs-divider">
            <span className="vs-text">VS</span>
          </div>

          {/* Friend */}
          <div className={`vs-card ${result.winner === 'friend' ? 'winner' : ''} ${showWinner ? 'revealed' : ''}`}>
            <div className="vs-card-label">YOU</div>
            <div className="vs-card-name">{result.friend.name}</div>
            <div className="vs-card-score">
              <span className="vs-score-number">{result.friend.score}</span>
              <span className="vs-score-percent">%</span>
            </div>
            <div className="vs-card-korean">{result.friend.koreanName}</div>
            {result.winner === 'friend' && showWinner && (
              <div className="vs-winner-badge">
                {getWinnerEmoji()} {getWinnerMessage()}
              </div>
            )}
          </div>
        </div>

        {/* Tie Result */}
        {result.winner === 'tie' && showWinner && (
          <div className="vs-tie-banner">
            🤝 PERFECT TIE! Both soulmates! 🤝
          </div>
        )}

        {/* Score Difference */}
        {showWinner && result.winner !== 'tie' && (
          <div className="vs-score-diff">
            <span className="diff-value">+{result.scoreDiff}%</span>
            <span className="diff-label">advantage</span>
          </div>
        )}

        {/* Actions */}
        {animationDone && (
          <div className="vs-actions">
            <button className="vs-action-btn share" onClick={handleShareX}>
              𝕏 Share Battle
            </button>
            <button className="vs-action-btn copy" onClick={handleShare}>
              📋 Copy
            </button>
            <button className="vs-action-btn rematch" onClick={onRematch}>
              🔄 Rematch
            </button>
            <button className="vs-action-btn close" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        )}
      </div>

      <style>{`
        .vs-battle-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
          padding: 16px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .vs-battle-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 24px;
          padding: 32px 24px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 2px solid #ff6b9d;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .vs-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .vs-header h2 {
          color: #fff;
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0;
          text-shadow: 0 0 20px rgba(255, 107, 157, 0.5);
        }

        .vs-icon {
          font-size: 1.5rem;
          animation: pulse 1s ease infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .vs-idol-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .vs-idol-name {
          color: #ff6b9d;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .vs-idol-group {
          color: #888;
          font-size: 0.9rem;
        }

        .vs-cards {
          display: flex;
          align-items: stretch;
          gap: 16px;
          margin-bottom: 24px;
        }

        .vs-card {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px 16px;
          border: 2px solid transparent;
          transition: all 0.5s ease;
          position: relative;
        }

        .vs-card.revealed.winner {
          background: rgba(255, 215, 0, 0.15);
          border-color: #ffd700;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        }

        .vs-card-label {
          color: #888;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .vs-card-name {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vs-card-score {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
        }

        .vs-score-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #fff;
          animation: countUp 1.5s ease forwards;
        }

        .vs-score-percent {
          font-size: 1.2rem;
          color: #888;
        }

        .vs-card-korean {
          color: #aaa;
          font-size: 0.9rem;
          margin-top: 8px;
        }

        .vs-winner-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          color: #000;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          white-space: nowrap;
          animation: popIn 0.3s ease;
        }

        @keyframes popIn {
          0% { transform: translateX(-50%) scale(0); }
          70% { transform: translateX(-50%) scale(1.1); }
          100% { transform: translateX(-50%) scale(1); }
        }

        .vs-divider {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vs-text {
          background: linear-gradient(135deg, #ff6b9d, #c44569);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 1.5rem;
          font-weight: 900;
        }

        .vs-tie-banner {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          margin-bottom: 16px;
          animation: popIn 0.3s ease;
        }

        .vs-score-diff {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
        }

        .diff-value {
          color: #4ade80;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .diff-label {
          color: #888;
          font-size: 0.8rem;
        }

        .vs-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .vs-action-btn {
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .vs-action-btn.share {
          background: #1da1f2;
          color: white;
        }

        .vs-action-btn.copy {
          background: #444;
          color: white;
        }

        .vs-action-btn.rematch {
          background: linear-gradient(135deg, #ff6b9d, #c44569);
          color: white;
        }

        .vs-action-btn.close {
          background: transparent;
          color: #888;
          border: 1px solid #444;
        }

        .vs-action-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        @media (max-width: 480px) {
          .vs-battle-modal {
            padding: 24px 16px;
          }

          .vs-header h2 {
            font-size: 1.4rem;
          }

          .vs-cards {
            flex-direction: column;
            gap: 12px;
          }

          .vs-divider {
            padding: 8px 0;
          }

          .vs-score-number {
            font-size: 2rem;
          }

          .vs-actions {
            flex-direction: column;
          }

          .vs-action-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

