/**
 * FlipCard Component
 * Front: Chemistry result display
 * Back: Shareable image card with style selection + download
 */

import { useState, useRef, useCallback, useEffect, type CSSProperties } from 'react';
import type { ChemistryTier } from '@/lib/generator';

interface DeepAnalysisCategory {
  name: string;
  score: number;
  emoji: string;
  description: string;
}

interface DeepAnalysis {
  categories: DeepAnalysisCategory[];
  luckyColor: string;
  luckyNumber: number;
  recommendedSong: string;
}

interface CoupleNames {
  cute: string;
  chaos: string;
  instaBio: string;
  hashtag: string;
  korean: string;
  fanficName: string;
  shipMotto: string;
}

interface FlipCardProps {
  userName: string;
  kpopName: {
    full_kr: string;
    full_en: string;
  };
  sameName: {
    full_kr: string;
    full_en: string;
  };
  idol: {
    name_en: string;
    name_kr: string;
    group: string;
    gender: 'male' | 'female';
  };
  chemistry: number;
  chemistryTier: ChemistryTier | null;
  deepAnalysis: DeepAnalysis | null;
  coupleNames: CoupleNames | null;
  isFirstResult: boolean;
  onReroll: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

type CardStyle = 'classic' | 'dark' | 'y2k' | 'meme';

const CARD_STYLES: { id: CardStyle; name: string; emoji: string }[] = [
  { id: 'classic', name: 'K-Pop', emoji: '💜' },
  { id: 'dark', name: 'Dark', emoji: '🌙' },
  { id: 'y2k', name: 'Y2K', emoji: '✨' },
  { id: 'meme', name: 'Meme', emoji: '🔥' },
];

// Idol-specific themes
const IDOL_THEMES: Record<string, {
  gradient: string;
  emoji: string;
  fandomEmoji: string;
  fandomMessage: string;
  tierBg: string;
}> = {
  'Jungkook': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🐰', fandomEmoji: '💜', fandomMessage: '보라해 💜', tierBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  'V': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🐯', fandomEmoji: '💜', fandomMessage: '보라해 💜', tierBg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
  'Lisa': { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #3d0a0a 50%, #831843 100%)', emoji: '👑', fandomEmoji: '🖤💗', fandomMessage: 'BLINK 🖤💗', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  'Felix': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🌞', fandomEmoji: '❤️', fandomMessage: 'STAY ❤️', tierBg: 'linear-gradient(135deg, #f97316, #ea580c)' },
  'Hanni': { gradient: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 50%, #60a5fa 100%)', emoji: '🐱', fandomEmoji: '💙', fandomMessage: 'Bunnies 🐰💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  'default': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '💜', fandomEmoji: '💜', fandomMessage: 'K-Pop 💜', tierBg: 'linear-gradient(135deg, #a855f7, #8b5cf6)' },
};

const GROUP_THEMES: Record<string, {
  gradient: string;
  emoji: string;
  fandomEmoji: string;
  fandomMessage: string;
  tierBg: string;
}> = {
  'BTS': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '💜', fandomEmoji: '💜', fandomMessage: '보라해 💜', tierBg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
  'BLACKPINK': { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #3d0a0a 50%, #831843 100%)', emoji: '🖤', fandomEmoji: '🖤💗', fandomMessage: 'BLINK 🖤💗', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  'Stray Kids': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '❤️', fandomEmoji: '❤️', fandomMessage: 'STAY ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  'NewJeans': { gradient: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 50%, #60a5fa 100%)', emoji: '🐰', fandomEmoji: '💙', fandomMessage: 'Bunnies 🐰💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  'TWICE': { gradient: 'linear-gradient(180deg, #ff6b9d 0%, #ffa07a 50%, #ffd700 100%)', emoji: '🍭', fandomEmoji: '🍭', fandomMessage: 'ONCE 🍭', tierBg: 'linear-gradient(135deg, #ff6b9d, #ff4757)' },
  'aespa': { gradient: 'linear-gradient(180deg, #1a1a2e 0%, #4c1d95 50%, #7c3aed 100%)', emoji: '🦋', fandomEmoji: '🦋', fandomMessage: 'MY 🦋', tierBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  'IVE': { gradient: 'linear-gradient(180deg, #fdf4ff 0%, #f5d0fe 50%, #d946ef 100%)', emoji: '💎', fandomEmoji: '🩷', fandomMessage: 'DIVE 💎', tierBg: 'linear-gradient(135deg, #d946ef, #c026d3)' },
  'LE SSERAFIM': { gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #3b3b3b 100%)', emoji: '🪽', fandomEmoji: '🖤', fandomMessage: 'FEARLESS 🪽', tierBg: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  'SEVENTEEN': { gradient: 'linear-gradient(180deg, #fef3c7 0%, #fcd34d 50%, #f59e0b 100%)', emoji: '💎', fandomEmoji: '💎', fandomMessage: 'CARAT 💎', tierBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  'default': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '💜', fandomEmoji: '💜', fandomMessage: 'K-Pop 💜', tierBg: 'linear-gradient(135deg, #a855f7, #8b5cf6)' },
};

export default function FlipCard({
  userName,
  kpopName,
  sameName,
  idol,
  chemistry,
  chemistryTier,
  deepAnalysis,
  coupleNames,
  isFirstResult,
  onReroll,
  onReset,
  isGenerating
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('classic');
  const [isDownloading, setIsDownloading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Get theme
  const theme = IDOL_THEMES[idol.name_en] || GROUP_THEMES[idol.group] || IDOL_THEMES['default'];
  const tierEmoji = chemistryTier?.name === 'Mythical' ? '🔥' : chemistryTier?.name === 'Legendary' ? '✨' : chemistryTier?.name === 'Epic' ? '⚡' : '💎';
  const starCount = chemistry >= 95 ? 5 : chemistry >= 85 ? 4 : chemistry >= 75 ? 3 : 2;
  const stars = '⭐'.repeat(starCount);
  const isLightTheme = ['NewJeans', 'IVE', 'ITZY', 'SEVENTEEN'].includes(idol.group);

  // Load fonts for share card
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&family=Outfit:wght@400;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
    
    return () => {
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const downloadCard = useCallback(async () => {
    if (!shareCardRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `${userName}-${idol.name_en}-chemistry.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [userName, idol.name_en]);

  // Get highest analysis category
  const topCategory = deepAnalysis?.categories.reduce((max, cat) => 
    cat.score > max.score ? cat : max
  , deepAnalysis.categories[0]);

  return (
    <>
      <div className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card">
          {/* FRONT SIDE - Result Display */}
          <div 
            className="flip-card-front"
            style={{ '--tier-gradient': chemistryTier?.bgGradient } as CSSProperties}
            onClick={handleFlip}
          >
            {/* Tier Badge */}
            <div className="front-tier">
              <span className="tier-emoji">{chemistryTier?.emoji}</span>
              <span className="tier-name">{chemistryTier?.name}</span>
              {chemistryTier?.rarity && (
                <span className="tier-rarity">{chemistryTier.rarity}</span>
              )}
            </div>

            {/* Main Score */}
            <div className="front-score-section">
              <div className="score-circle" style={{ '--score': chemistry } as CSSProperties}>
                <div className="score-inner">
                  <span className="score-value">{chemistry}</span>
                  <span className="score-percent">%</span>
                </div>
              </div>
              <p className="score-message">{chemistryTier?.message}</p>
            </div>

            {/* Idol Info */}
            <div className="front-idol">
              <span className="idol-emoji">{theme.emoji}</span>
              <span className="idol-name">{idol.name_en}</span>
              <span className="idol-group">({idol.group})</span>
            </div>

            {/* K-Pop Name */}
            <div className="front-name-section">
              <span className="name-label">Your K-Pop Name</span>
              <span className="name-korean">{kpopName.full_kr}</span>
              <span className="name-english">{kpopName.full_en}</span>
            </div>

            {/* Analysis Preview */}
            {deepAnalysis && (
              <div className="front-analysis-preview">
                <div className="analysis-mini">
                  {deepAnalysis.categories.slice(0, 2).map((cat, idx) => (
                    <div key={idx} className="mini-bar">
                      <span className="mini-label">{cat.emoji} {cat.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flip Hint */}
            <div className="flip-hint">
              <span className="hint-icon">👆</span>
              <span className="hint-text">Tap to get share card</span>
            </div>
          </div>

          {/* BACK SIDE - Share Card */}
          <div className="flip-card-back" onClick={(e) => e.stopPropagation()}>
            {/* Style Selector */}
            <div className="back-style-selector">
              {CARD_STYLES.map((style) => (
                <button
                  key={style.id}
                  className={`style-btn ${selectedStyle === style.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStyle(style.id);
                  }}
                >
                  <span>{style.emoji}</span>
                  <span className="style-name">{style.name}</span>
                </button>
              ))}
            </div>

            {/* Share Card Preview */}
            <div className="share-card-wrapper">
              <div 
                ref={shareCardRef}
                className={`share-card share-card-${selectedStyle} ${isLightTheme && selectedStyle === 'classic' ? 'light-theme' : ''}`}
                style={{ 
                  '--idol-gradient': theme.gradient,
                  '--tier-bg': theme.tierBg,
                } as CSSProperties}
              >
                {/* Classic Style */}
                {selectedStyle === 'classic' && (
                  <div className="card-classic">
                    <div className="classic-bg-emoji">{theme.emoji}</div>
                    <div className="classic-content">
                      <div className="classic-header">
                        <span className="classic-site">kpopnamegenerator.com</span>
                      </div>
                      <div className="classic-score-section">
                        <span className="classic-emoji">{theme.emoji}</span>
                        <span className="classic-score">{chemistry}%</span>
                        <span className="classic-stars">{stars}</span>
                      </div>
                      <div className="classic-tier" style={{ background: theme.tierBg }}>
                        {tierEmoji} {chemistryTier?.name}
                      </div>
                      <div className="classic-names">
                        <span className="classic-user-name-en">{kpopName.full_en}</span>
                        <span className="classic-user-name-kr">{kpopName.full_kr}</span>
                        <span className="classic-x">×</span>
                        <span className="classic-idol-name">{idol.name_en}</span>
                        <span className="classic-idol-kr">{idol.name_kr}</span>
                      </div>
                      <div className="classic-ship-box">
                        <span className="classic-ship-label">Ship Name</span>
                        <span className="classic-ship-main">{theme.emoji} {coupleNames?.cute || coupleNames?.korean} {theme.emoji}</span>
                        <span className="classic-ship-sub">{coupleNames?.hashtag}</span>
                      </div>
                      <div className="classic-footer">
                        <span className="classic-fandom">{theme.fandomMessage}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dark Style */}
                {selectedStyle === 'dark' && (
                  <div className="card-dark">
                    <div className="dark-content">
                      <div className="dark-header">
                        <span className="dark-tier">{tierEmoji} {chemistryTier?.name}</span>
                      </div>
                      <div className="dark-score">{chemistry}%</div>
                      <div className="dark-better">better than 99% of fans</div>
                      <div className="dark-names">
                        <span className="dark-english">{kpopName.full_en}</span>
                        <span className="dark-korean">{kpopName.full_kr}</span>
                        <span className="dark-x">×</span>
                        <span className="dark-idol">{idol.name_en}</span>
                      </div>
                      <div className="dark-ship">"{coupleNames?.shipMotto}"</div>
                      <div className="dark-hashtag">{coupleNames?.hashtag}</div>
                      <div className="dark-footer">kpopnamegenerator.com</div>
                    </div>
                  </div>
                )}

                {/* Y2K Style */}
                {selectedStyle === 'y2k' && (
                  <div className="card-y2k">
                    <div className="y2k-sparkles">✨ ⭐ 💫 ✨</div>
                    <div className="y2k-content">
                      <div className="y2k-score">{chemistry}%</div>
                      <div className="y2k-match">MATCH!</div>
                      <div className="y2k-names">
                        <span className="y2k-english">{kpopName.full_en}</span>
                        <span className="y2k-korean">{kpopName.full_kr}</span>
                        <span className="y2k-heart">♡</span>
                        <span className="y2k-idol">{idol.name_en}</span>
                      </div>
                      <div className="y2k-ship">{coupleNames?.cute}</div>
                      <div className="y2k-tier">{chemistryTier?.name} {tierEmoji}</div>
                    </div>
                    <div className="y2k-footer">kpopnamegenerator.com 💖</div>
                  </div>
                )}

                {/* Meme Style */}
                {selectedStyle === 'meme' && (
                  <div className="card-meme">
                    <div className="meme-header">POV: finding your K-pop soulmate</div>
                    <div className="meme-content">
                      <div className="meme-score">{chemistry}%</div>
                      <div className="meme-reaction">
                        {chemistry >= 90 ? '😭💀 IM SCREAMING' : chemistry >= 80 ? '🥹 no way...' : '👀 interesting...'}
                      </div>
                      <div className="meme-names">
                        <span className="meme-english">{kpopName.full_en}</span>
                        <span className="meme-korean">{kpopName.full_kr}</span>
                        <span className="meme-x">x</span>
                        <span>{idol.name_en}</span>
                      </div>
                      <div className="meme-ship">ship name: {coupleNames?.chaos}</div>
                      <div className="meme-tag">
                        {chemistry >= 90 ? 'literally canon' : chemistry >= 80 ? 'fate wrote this' : 'the algorithm knows'}
                      </div>
                    </div>
                    <div className="meme-footer">kpopnamegenerator.com</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="back-actions">
              <button 
                className="download-btn"
                onClick={downloadCard}
                disabled={isDownloading || !fontsLoaded}
              >
                {isDownloading ? '⏳ Saving...' : '📸 Download'}
              </button>
              <button 
                className="flip-back-btn"
                onClick={handleFlip}
              >
                ↩ Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Always visible below card) */}
      <div className="flip-actions">
        <button className="action-btn secondary" onClick={onReset}>
          ← New
        </button>
        <button 
          className="action-btn reroll" 
          onClick={(e) => {
            e.stopPropagation();
            onReroll();
          }}
          disabled={isGenerating}
        >
          {isGenerating ? '...' : '🎲 Re-roll'}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .flip-card-container {
          perspective: 1200px;
          width: 100%;
          max-width: 340px;
          margin: 0 auto 16px;
        }

        .flip-card {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 14;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flip-card-container.flipped .flip-card {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }

        /* FRONT SIDE */
        .flip-card-front {
          background: var(--tier-gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
        }

        .front-tier {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(10px);
          padding: 6px 14px;
          border-radius: 50px;
          margin-bottom: 12px;
        }

        .tier-emoji { font-size: 1.2rem; }
        .tier-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .tier-rarity {
          font-size: 0.65rem;
          background: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 10px;
          color: rgba(255,255,255,0.9);
        }

        .front-score-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(
            rgba(255,255,255,0.9) calc(var(--score) * 1%),
            rgba(255,255,255,0.15) calc(var(--score) * 1%)
          );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-inner {
          width: 100px;
          height: 100px;
          background: rgba(0,0,0,0.35);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .score-percent {
          font-size: 1.2rem;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
        }

        .score-message {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.95);
          font-weight: 500;
          max-width: 90%;
        }

        .front-idol {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: #fff;
          background: rgba(0,0,0,0.2);
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 10px;
        }

        .idol-name { font-weight: 700; }
        .idol-group { opacity: 0.8; font-size: 0.8rem; }

        .front-name-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 12px 20px;
          border-radius: 14px;
          width: 100%;
          margin-bottom: 8px;
        }

        .name-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.7);
        }

        .name-korean {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
        }

        .name-english {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.85);
        }

        .front-analysis-preview {
          margin-bottom: 8px;
        }

        .analysis-mini {
          display: flex;
          gap: 10px;
        }

        .mini-bar {
          background: rgba(255,255,255,0.2);
          padding: 4px 10px;
          border-radius: 12px;
        }

        .mini-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.9);
        }

        .flip-hint {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* BACK SIDE */
        .flip-card-back {
          background: var(--surface, #1a1a2e);
          transform: rotateY(180deg);
          padding: 12px;
          display: flex;
          flex-direction: column;
        }

        .back-style-selector {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
          justify-content: center;
        }

        .style-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: rgba(128,128,128,0.15);
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.75rem;
          color: var(--text, #fff);
          transition: all 0.2s;
        }

        .style-btn:hover {
          background: rgba(128,128,128,0.25);
        }

        .style-btn.active {
          border-color: var(--accent, #a855f7);
          background: rgba(168, 85, 247, 0.2);
        }

        .style-name {
          display: none;
        }

        @media (min-width: 360px) {
          .style-name { display: inline; }
        }

        .share-card-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .share-card {
          width: 280px;
          height: 380px;
          border-radius: 16px;
          overflow: hidden;
          font-family: 'Outfit', 'Noto Sans KR', sans-serif;
        }

        /* Classic Card */
        .card-classic {
          width: 100%;
          height: 100%;
          background: var(--idol-gradient);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .classic-bg-emoji {
          position: absolute;
          font-size: 120px;
          opacity: 0.1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .classic-content {
          position: relative;
          z-index: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          color: #fff;
        }

        .share-card.light-theme .classic-content {
          color: #1a1a2e;
        }

        .classic-header {
          font-size: 0.6rem;
          opacity: 0.7;
          margin-bottom: 8px;
        }

        .classic-score-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 6px;
        }

        .classic-emoji { font-size: 1.5rem; }
        .classic-score {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1;
        }
        .classic-stars { font-size: 0.9rem; }

        .classic-tier {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }

        .classic-names {
          text-align: center;
          margin-bottom: 10px;
        }

        .classic-user-name-en {
          display: block;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .classic-user-name-kr {
          display: block;
          font-size: 0.85rem;
          opacity: 0.75;
          margin-bottom: 4px;
        }

        .classic-x {
          display: block;
          font-size: 0.8rem;
          opacity: 0.6;
          margin: 4px 0;
        }

        .classic-idol-name {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .classic-idol-kr {
          display: block;
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .classic-ship-box {
          background: rgba(0,0,0,0.2);
          padding: 8px 14px;
          border-radius: 10px;
          text-align: center;
          margin-top: auto;
        }

        .share-card.light-theme .classic-ship-box {
          background: rgba(0,0,0,0.1);
        }

        .classic-ship-label {
          display: block;
          font-size: 0.55rem;
          opacity: 0.6;
          text-transform: uppercase;
        }

        .classic-ship-main {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .classic-ship-sub {
          display: block;
          font-size: 0.65rem;
          opacity: 0.7;
        }

        .classic-footer {
          margin-top: 8px;
          font-size: 0.65rem;
          opacity: 0.8;
        }

        /* Dark Card */
        .card-dark {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%);
          display: flex;
          flex-direction: column;
        }

        .dark-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          color: #fff;
          text-align: center;
        }

        .dark-header { margin-bottom: 10px; }
        .dark-tier {
          font-size: 0.8rem;
          color: #a855f7;
        }

        .dark-score {
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .dark-better {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 16px;
        }

        .dark-names {
          margin-bottom: 12px;
        }

        .dark-english {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .dark-korean {
          display: block;
          font-size: 0.85rem;
          opacity: 0.6;
          margin-bottom: 4px;
        }

        .dark-x {
          display: block;
          font-size: 0.8rem;
          opacity: 0.4;
          margin: 4px 0;
        }

        .dark-idol {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .dark-ship {
          font-size: 0.85rem;
          font-style: italic;
          opacity: 0.8;
          margin-bottom: 8px;
        }

        .dark-hashtag {
          font-size: 0.75rem;
          color: #a855f7;
        }

        .dark-footer {
          margin-top: auto;
          font-size: 0.6rem;
          opacity: 0.4;
        }

        /* Y2K Card */
        .card-y2k {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ff6b9d 0%, #c084fc 50%, #60a5fa 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          color: #fff;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        .y2k-sparkles {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .y2k-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .y2k-score {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
        }

        .y2k-match {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 4px;
          margin-bottom: 16px;
        }

        .y2k-names {
          margin-bottom: 12px;
        }

        .y2k-english {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .y2k-korean {
          display: block;
          font-size: 0.85rem;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .y2k-heart {
          display: block;
          font-size: 1.5rem;
          margin: 4px 0;
        }

        .y2k-idol {
          display: block;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .y2k-ship {
          font-size: 0.9rem;
          background: rgba(255,255,255,0.2);
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 8px;
        }

        .y2k-tier {
          font-size: 0.8rem;
          font-weight: 700;
        }

        .y2k-footer {
          font-size: 0.65rem;
          opacity: 0.8;
        }

        /* Meme Card */
        .card-meme {
          width: 100%;
          height: 100%;
          background: #fff;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
        }

        .meme-header {
          background: #1a1a2e;
          color: #fff;
          padding: 10px;
          font-size: 0.8rem;
          text-align: center;
        }

        .meme-content {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #1a1a2e;
        }

        .meme-score {
          font-size: 4rem;
          font-weight: 900;
          color: #a855f7;
          line-height: 1;
        }

        .meme-reaction {
          font-size: 1rem;
          margin-bottom: 12px;
        }

        .meme-names {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .meme-english {
          font-size: 1.2rem;
          font-weight: 800;
        }

        .meme-korean {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 4px;
        }

        .meme-x {
          color: #ec4899;
          font-size: 1rem;
          margin: 4px 0;
        }

        .meme-ship {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 8px;
        }

        .meme-tag {
          background: #a855f7;
          color: #fff;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .meme-footer {
          background: #f0f0f0;
          padding: 8px;
          font-size: 0.6rem;
          text-align: center;
          color: #666;
        }

        /* Back Actions */
        .back-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .download-btn {
          flex: 1;
          padding: 10px;
          background: linear-gradient(135deg, #ff6b9d, #a855f7);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .download-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }

        .download-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .flip-back-btn {
          padding: 10px 16px;
          background: rgba(128,128,128,0.2);
          border: none;
          border-radius: 10px;
          color: var(--text, #fff);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .flip-back-btn:hover {
          background: rgba(128,128,128,0.3);
        }

        /* Bottom Actions */
        .flip-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .flip-actions .action-btn {
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .flip-actions .action-btn.secondary {
          background: var(--surface, #f3f4f6);
          color: var(--text, #374151);
          border: 1px solid rgba(128,128,128,0.2);
        }

        .flip-actions .action-btn.secondary:hover {
          background: var(--chip, #e5e7eb);
        }

        .flip-actions .action-btn.reroll {
          background: linear-gradient(135deg, #ff6b9d, #a855f7);
          color: #fff;
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
        }

        .flip-actions .action-btn.reroll:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
        }

        .flip-actions .action-btn.reroll:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Mobile */
        @media (max-width: 380px) {
          .flip-card-container {
            max-width: 300px;
          }

          .share-card {
            width: 240px;
            height: 330px;
          }

          .flip-actions {
            flex-direction: column;
            gap: 8px;
            padding: 0 20px;
          }

          .flip-actions .action-btn {
            width: 100%;
          }
        }
      `}} />
    </>
  );
}
