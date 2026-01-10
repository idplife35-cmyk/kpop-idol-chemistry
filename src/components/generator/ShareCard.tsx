/**
 * ShareCard Component - Generate downloadable share images
 * 4 styles: K-Pop Classic, Dark Chaos, Y2K Holo, Meme
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { GeneratorResult } from '@/lib/generator';

interface ShareCardProps {
  result: GeneratorResult;
  userName: string;
  koreanName: string;
  idolName: string;
  idolNameKr: string;
  groupName: string;
  chemistry: number;
  chemistryTier: string;
  shipName: {
    korean: string;
    english: string;
    cute?: string;
  };
  memberEmoji?: string;
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
  // BTS members
  'Jungkook': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🐰', fandomEmoji: '💜', fandomMessage: '보라해 💜 I Purple You', tierBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  'V': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🐯', fandomEmoji: '💜', fandomMessage: '보라해 💜 I Purple You', tierBg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
  'Jimin': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🐥', fandomEmoji: '💜', fandomMessage: '보라해 💜 I Purple You', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  'RM': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🐨', fandomEmoji: '💜', fandomMessage: '보라해 💜 I Purple You', tierBg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  'Jin': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🦙', fandomEmoji: '💜', fandomMessage: '보라해 💜 I Purple You', tierBg: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  'Suga': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🐱', fandomEmoji: '💜', fandomMessage: '보라해 💜 I Purple You', tierBg: 'linear-gradient(135deg, #22d3ee, #06b6d4)' },
  'J-Hope': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '🐿️', fandomEmoji: '💜', fandomMessage: '보라해 💜 I Purple You', tierBg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  // BLACKPINK members
  'Lisa': { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #3d0a0a 50%, #831843 100%)', emoji: '👑', fandomEmoji: '🖤💗', fandomMessage: 'Born to be a BLINK 🖤💗', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  'Jennie': { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #3d0a0a 50%, #831843 100%)', emoji: '🐻', fandomEmoji: '🖤💗', fandomMessage: 'Born to be a BLINK 🖤💗', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  'Rosé': { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #3d0a0a 50%, #831843 100%)', emoji: '🌹', fandomEmoji: '🖤💗', fandomMessage: 'Born to be a BLINK 🖤💗', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  'Jisoo': { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #3d0a0a 50%, #831843 100%)', emoji: '🐰', fandomEmoji: '🖤💗', fandomMessage: 'Born to be a BLINK 🖤💗', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  // Stray Kids members
  'Felix': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🌞', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #f97316, #ea580c)' },
  'Hyunjin': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🦊', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  'Bang Chan': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🐺', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  'Lee Know': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🐱', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  'Changbin': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🐷', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  'Han': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🐿️', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  'Seungmin': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🐶', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  'I.N': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '🦊', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  // NewJeans members
  'Hanni': { gradient: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 50%, #60a5fa 100%)', emoji: '🐱', fandomEmoji: '💙', fandomMessage: 'Get up, Bunnies! 🐰💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  'Minji': { gradient: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 50%, #60a5fa 100%)', emoji: '🐰', fandomEmoji: '💙', fandomMessage: 'Get up, Bunnies! 🐰💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  'Danielle': { gradient: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 50%, #60a5fa 100%)', emoji: '🐱', fandomEmoji: '💙', fandomMessage: 'Get up, Bunnies! 🐰💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  'Haerin': { gradient: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 50%, #60a5fa 100%)', emoji: '🐱', fandomEmoji: '💙', fandomMessage: 'Get up, Bunnies! 🐰💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  'Hyein': { gradient: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 50%, #60a5fa 100%)', emoji: '🐶', fandomEmoji: '💙', fandomMessage: 'Get up, Bunnies! 🐰💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  // Default for others
  'default': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '💜', fandomEmoji: '💜', fandomMessage: 'K-Pop Forever 💜', tierBg: 'linear-gradient(135deg, #a855f7, #8b5cf6)' },
};

// Group-based default themes
const GROUP_THEMES: Record<string, {
  gradient: string;
  emoji: string;
  fandomEmoji: string;
  fandomMessage: string;
  tierBg: string;
}> = {
  'BTS': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '💜', fandomEmoji: '💜', fandomMessage: '보라해 💜 I Purple You', tierBg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
  'BLACKPINK': { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #3d0a0a 50%, #831843 100%)', emoji: '🖤', fandomEmoji: '🖤💗', fandomMessage: 'Born to be a BLINK 🖤💗', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  'Stray Kids': { gradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)', emoji: '❤️', fandomEmoji: '❤️', fandomMessage: 'STAY with me forever ❤️', tierBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  'NewJeans': { gradient: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 50%, #60a5fa 100%)', emoji: '🐰', fandomEmoji: '💙', fandomMessage: 'Get up, Bunnies! 🐰💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  'TWICE': { gradient: 'linear-gradient(180deg, #ff6b9d 0%, #ffa07a 50%, #ffd700 100%)', emoji: '🍭', fandomEmoji: '🍭', fandomMessage: 'ONCE makes TWICE shine! 🍭', tierBg: 'linear-gradient(135deg, #ff6b9d, #ff4757)' },
  'aespa': { gradient: 'linear-gradient(180deg, #1a1a2e 0%, #4c1d95 50%, #7c3aed 100%)', emoji: '🦋', fandomEmoji: '🦋', fandomMessage: 'MY is with aespa 🦋', tierBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  'IVE': { gradient: 'linear-gradient(180deg, #fdf4ff 0%, #f5d0fe 50%, #d946ef 100%)', emoji: '💎', fandomEmoji: '🩷', fandomMessage: 'I HAVE IVE 💎', tierBg: 'linear-gradient(135deg, #d946ef, #c026d3)' },
  'LE SSERAFIM': { gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #3b3b3b 100%)', emoji: '🪽', fandomEmoji: '🖤', fandomMessage: 'FEARLESS forever 🪽', tierBg: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  'SEVENTEEN': { gradient: 'linear-gradient(180deg, #fef3c7 0%, #fcd34d 50%, #f59e0b 100%)', emoji: '💎', fandomEmoji: '💎', fandomMessage: 'CARAT shines bright 💎', tierBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  'EXO': { gradient: 'linear-gradient(180deg, #d4d4d4 0%, #a1a1aa 50%, #71717a 100%)', emoji: '🌙', fandomEmoji: '🌙', fandomMessage: 'EXO-L forever 🌙', tierBg: 'linear-gradient(135deg, #71717a, #52525b)' },
  'TXT': { gradient: 'linear-gradient(180deg, #dbeafe 0%, #93c5fd 50%, #3b82f6 100%)', emoji: '💙', fandomEmoji: '💙', fandomMessage: 'MOA together forever 💙', tierBg: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  'ENHYPEN': { gradient: 'linear-gradient(180deg, #0c0a09 0%, #1c1917 50%, #44403c 100%)', emoji: '🦇', fandomEmoji: '🖤', fandomMessage: 'ENGENE connected 🦇', tierBg: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  'ITZY': { gradient: 'linear-gradient(180deg, #fdf2f8 0%, #fbcfe8 50%, #ec4899 100%)', emoji: '💕', fandomEmoji: '💕', fandomMessage: 'MIDZY trust ITZY! 💕', tierBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  'default': { gradient: 'linear-gradient(180deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', emoji: '💜', fandomEmoji: '💜', fandomMessage: 'K-Pop Forever 💜', tierBg: 'linear-gradient(135deg, #a855f7, #8b5cf6)' },
};

export default function ShareCard({
  result,
  userName,
  koreanName,
  idolName,
  idolNameKr,
  groupName,
  chemistry,
  chemistryTier,
  shipName,
  memberEmoji = '💜',
}: ShareCardProps) {
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get theme based on idol first, then group, then default
  const theme = IDOL_THEMES[idolName] || GROUP_THEMES[groupName] || IDOL_THEMES['default'];
  const tierEmoji = chemistryTier === 'Mythical' ? '🔥' : chemistryTier === 'Legendary' ? '✨' : chemistryTier === 'Epic' ? '⚡' : '💎';
  
  // Stars based on chemistry
  const starCount = chemistry >= 95 ? 5 : chemistry >= 85 ? 4 : chemistry >= 75 ? 3 : 2;
  const stars = '⭐'.repeat(starCount);

  // Light theme cards need dark text
  const isLightTheme = groupName === 'NewJeans' || groupName === 'IVE' || groupName === 'ITZY' || groupName === 'SEVENTEEN';

  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&family=Outfit:wght@400;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Wait for fonts to load
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const downloadCard = useCallback(async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      // Dynamic import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      // Get the scale wrapper and temporarily reset transform
      const scaleWrapper = cardRef.current.parentElement;
      const originalTransform = scaleWrapper?.style.transform || '';
      if (scaleWrapper) {
        scaleWrapper.style.transform = 'none';
      }
      
      // Wait for reflow
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: 400,
        windowHeight: 700,
      });
      
      // Restore transform
      if (scaleWrapper) {
        scaleWrapper.style.transform = originalTransform;
      }
      
      const link = document.createElement('a');
      link.download = `${userName}-${idolName}-chemistry.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [userName, idolName]);

  return (
    <div className="share-card-container">
      {/* Style Selector */}
      <div className="style-selector">
        <span className="selector-label">Choose Style:</span>
        <div className="style-buttons">
          {CARD_STYLES.map((style) => (
            <button
              key={style.id}
              className={`style-btn ${selectedStyle === style.id ? 'active' : ''}`}
              onClick={() => setSelectedStyle(style.id)}
            >
              <span className="style-emoji">{style.emoji}</span>
              <span className="style-name">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Card Preview */}
      <div className="card-preview-wrapper">
        <div className="card-scale-wrapper">
          <div 
            ref={cardRef} 
            className={`share-card share-card-${selectedStyle} ${isLightTheme && selectedStyle === 'classic' ? 'light-theme' : ''}`}
            style={{ 
              '--idol-gradient': theme.gradient,
              '--tier-bg': theme.tierBg,
            } as React.CSSProperties}
          >
          {selectedStyle === 'classic' && (
            <KpopClassicCard
              userName={userName}
              koreanName={koreanName}
              idolName={idolName}
              idolNameKr={idolNameKr}
              groupName={groupName}
              chemistry={chemistry}
              chemistryTier={chemistryTier}
              tierEmoji={tierEmoji}
              stars={stars}
              shipName={shipName}
              memberEmoji={theme.emoji}
              fandomEmoji={theme.fandomEmoji}
              fandomMessage={theme.fandomMessage}
              isLightTheme={isLightTheme}
            />
          )}
          {selectedStyle === 'dark' && (
            <DarkCard
              userName={userName}
              koreanName={koreanName}
              idolName={idolName}
              idolNameKr={idolNameKr}
              chemistry={chemistry}
              chemistryTier={chemistryTier}
              tierEmoji={tierEmoji}
              shipName={shipName}
              memberEmoji={theme.emoji}
              fandomEmoji={theme.fandomEmoji}
            />
          )}
          {selectedStyle === 'y2k' && (
            <Y2KCard
              userName={userName}
              koreanName={koreanName}
              idolName={idolName}
              idolNameKr={idolNameKr}
              groupName={groupName}
              chemistry={chemistry}
              chemistryTier={chemistryTier}
              tierEmoji={tierEmoji}
              shipName={shipName}
              memberEmoji={theme.emoji}
            />
          )}
          {selectedStyle === 'meme' && (
            <MemeCard
              userName={userName}
              koreanName={koreanName}
              idolName={idolName}
              chemistry={chemistry}
              chemistryTier={chemistryTier}
              shipName={shipName}
              memberEmoji={theme.emoji}
            />
          )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button 
        className="download-btn"
        onClick={downloadCard}
        disabled={isGenerating || !fontsLoaded}
      >
        {isGenerating ? '⏳ Generating...' : '📸 Download Image'}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .share-card-container {
          margin-top: 24px;
          padding: 20px;
          background: var(--surface);
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .style-selector {
          margin-bottom: 20px;
        }

        .selector-label {
          display: block;
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .style-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .style-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: var(--chip, #f0f0f0);
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
          color: var(--text);
        }

        .style-btn:hover {
          background: var(--border);
        }

        .style-btn.active {
          border-color: var(--accent);
          background: rgba(168, 85, 247, 0.1);
        }

        .style-emoji {
          font-size: 16px;
        }

        .style-name {
          font-weight: 600;
        }

        .card-preview-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 16px 0;
          padding: 16px;
          background: #1a1a1a;
          border-radius: 16px;
          overflow: visible;
        }

        .card-scale-wrapper {
          transform-origin: center center;
        }

        /* Base Share Card - 9:16 (360x640) - Fixed size */
        .share-card {
          width: 360px;
          height: 640px;
          min-width: 360px;
          min-height: 640px;
          max-width: 360px;
          max-height: 640px;
          border-radius: 20px;
          overflow: hidden;
          flex-shrink: 0;
          font-family: 'Outfit', 'Noto Sans KR', -apple-system, sans-serif;
          position: relative;
          box-sizing: border-box;
        }

        /* Mobile scaling */
        @media (max-width: 420px) {
          .card-preview-wrapper {
            padding: 12px 8px;
          }
          
          .card-scale-wrapper {
            transform: scale(0.8);
          }
        }

        @media (max-width: 380px) {
          .card-scale-wrapper {
            transform: scale(0.7);
          }
        }

        .download-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .download-btn:hover {
          transform: translateY(-2px);
        }

        .download-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* ========== K-Pop Classic Style (Sample Match) ========== */
        .share-card-classic {
          background: var(--idol-gradient);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 20px 16px;
          color: white;
        }

        .share-card-classic.light-theme {
          color: #1e3a8a;
        }

        .share-card-classic.light-theme .classic-header,
        .share-card-classic.light-theme .classic-chem-label,
        .share-card-classic.light-theme .classic-ship-label {
          color: rgba(30, 58, 138, 0.6);
        }

        .share-card-classic.light-theme .classic-score,
        .share-card-classic.light-theme .classic-user-name,
        .share-card-classic.light-theme .classic-idol-name {
          color: #1e3a8a;
        }

        .share-card-classic.light-theme .classic-ship-box {
          background: rgba(255,255,255,0.8);
          color: #1e3a8a;
        }

        .classic-bg-emoji {
          position: absolute;
          font-size: 160px;
          opacity: 0.08;
          top: -20px;
          right: -30px;
          z-index: 0;
        }

        .classic-sparkle {
          position: absolute;
          font-size: 16px;
          opacity: 0.5;
          z-index: 1;
        }

        .classic-sparkle:nth-child(1) { top: 50px; left: 24px; }
        .classic-sparkle:nth-child(2) { top: 100px; right: 30px; }
        .classic-sparkle:nth-child(3) { bottom: 120px; left: 20px; }
        .classic-sparkle:nth-child(4) { bottom: 160px; right: 24px; }

        .classic-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }

        .classic-header {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 10px;
        }

        .classic-emoji {
          font-size: 44px;
          margin-bottom: 6px;
          filter: drop-shadow(0 4px 20px rgba(167, 139, 250, 0.5));
        }

        .classic-tier-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
          text-transform: uppercase;
          background: var(--tier-bg);
          color: #1a1a2e;
        }

        .classic-chem-label {
          font-size: 12px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 2px;
        }

        .classic-score {
          font-size: 60px;
          font-weight: 900;
          color: white;
          line-height: 1;
          margin-bottom: 2px;
          text-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }

        .classic-stars {
          font-size: 18px;
          margin-bottom: 12px;
          letter-spacing: 3px;
        }

        .classic-names {
          text-align: center;
          margin-bottom: 10px;
        }

        .classic-user-name {
          font-size: 18px;
          font-weight: 700;
          color: white;
        }

        .classic-heart {
          font-size: 20px;
          margin: 4px 0;
        }

        .classic-idol-name {
          font-size: 22px;
          font-weight: 800;
          color: white;
        }

        .classic-idol-kr {
          font-size: 13px;
          opacity: 0.8;
          margin-top: 2px;
        }

        .classic-ship-section {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 100%;
          margin-top: auto;
        }

        .classic-ship-label {
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 6px;
          text-align: center;
        }

        .classic-ship-box {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 10px 16px;
          text-align: center;
        }

        .classic-ship-main {
          font-size: 16px;
          font-weight: 700;
        }

        .classic-ship-sub {
          font-size: 11px;
          opacity: 0.8;
          margin-top: 2px;
        }

        .classic-hashtags {
          font-size: 10px;
          opacity: 0.7;
          margin-top: 6px;
          text-align: center;
        }

        .classic-footer {
          margin-top: 10px;
          text-align: center;
        }

        .classic-fandom-msg {
          font-size: 11px;
          opacity: 0.8;
          margin-bottom: 4px;
          font-style: italic;
        }

        .classic-url {
          font-size: 10px;
          opacity: 0.5;
          letter-spacing: 1px;
        }

        /* ========== Dark Style ========== */
        .share-card-dark {
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
        }

        .dark-gradient {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 180deg, #7c3aed, #ec4899, #f97316, #7c3aed);
          animation: rotate 10s linear infinite;
          opacity: 0.12;
          pointer-events: none;
        }

        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        .dark-inner {
          position: relative;
          z-index: 1;
          height: 640px;
          max-height: 640px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.99) 100%);
        }

        .dark-tag {
          align-self: flex-start;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .dark-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .dark-emoji {
          font-size: 50px;
          margin-bottom: 10px;
        }

        .dark-tier {
          font-size: 11px;
          letter-spacing: 4px;
          color: #a855f7;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .dark-score {
          font-size: 80px;
          font-weight: 800;
          color: white;
          line-height: 1;
          text-shadow: 0 0 50px #a855f7;
        }

        .dark-score-suffix {
          font-size: 28px;
          color: #555;
        }

        .dark-compare {
          font-size: 11px;
          color: #555;
          margin-top: 4px;
        }

        .dark-compare span {
          color: #a855f7;
          font-weight: 600;
        }

        .dark-pairing {
          margin-top: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dark-name {
          text-align: center;
        }

        .dark-name-en {
          font-size: 16px;
          font-weight: 600;
          color: white;
        }

        .dark-name-kr {
          font-size: 11px;
          color: #555;
          margin-top: 2px;
        }

        .dark-heart {
          font-size: 20px;
          filter: drop-shadow(0 0 15px #a855f7);
        }

        .dark-ship {
          margin-top: 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 10px 14px;
          border: 1px solid rgba(255,255,255,0.06);
          width: 100%;
          max-width: 260px;
          text-align: center;
        }

        .dark-ship-label {
          font-size: 9px;
          color: #444;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .dark-ship-name {
          font-size: 15px;
          font-weight: 600;
          color: white;
          margin-top: 4px;
        }

        .dark-ship-sub {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
        }

        .dark-footer {
          text-align: center;
        }

        .dark-cta {
          font-size: 11px;
          color: #555;
        }

        .dark-url {
          font-size: 10px;
          color: #333;
          margin-top: 4px;
        }

        /* ========== Y2K Style ========== */
        .share-card-y2k {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .share-card-y2k::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 30%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(34, 211, 238, 0.25) 0%, transparent 50%);
        }

        .y2k-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
        }

        .y2k-badge {
          align-self: center;
          background: linear-gradient(135deg, #e0e0e0, #a0a0a0, #e0e0e0);
          background-size: 200% 200%;
          animation: chrome 4s ease infinite;
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          color: #1a1a2e;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        @keyframes chrome {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .y2k-glass {
          margin-top: 14px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.15);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .y2k-emoji-row {
          display: flex;
          justify-content: center;
          gap: 8px;
          font-size: 26px;
          margin-bottom: 12px;
        }

        .y2k-score-section {
          text-align: center;
        }

        .y2k-score-label {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .y2k-score-big {
          font-size: 56px;
          font-weight: 800;
          background: linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .y2k-tier {
          display: inline-block;
          margin-top: 6px;
          padding: 5px 14px;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(139, 92, 246, 0.3));
          border-radius: 16px;
          font-size: 10px;
          font-weight: 600;
          color: white;
          letter-spacing: 2px;
        }

        .y2k-names {
          margin-top: 16px;
          text-align: center;
        }

        .y2k-name-line {
          font-size: 18px;
          font-weight: 600;
          color: white;
        }

        .y2k-name-line .heart {
          color: #ec4899;
          margin: 0 10px;
        }

        .y2k-korean-box {
          margin-top: 12px;
          padding: 10px 16px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          display: inline-block;
        }

        .y2k-korean-label {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .y2k-korean-text {
          font-size: 14px;
          color: white;
          margin-top: 2px;
        }

        .y2k-ship {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }

        .y2k-ship-title {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .y2k-ship-content {
          font-size: 13px;
          color: white;
          margin-top: 4px;
        }

        .y2k-hashtag {
          font-size: 10px;
          color: #8b5cf6;
          margin-top: 6px;
        }

        .y2k-footer {
          margin-top: 12px;
          text-align: center;
        }

        .y2k-url {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
        }

        /* ========== Meme Style ========== */
        .share-card-meme {
          background: linear-gradient(180deg, #1a0a0a 0%, #0a0a1a 100%);
        }

        .meme-inner {
          height: 100%;
          padding: 22px;
          display: flex;
          flex-direction: column;
        }

        .meme-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .meme-pill {
          background: #ef4444;
          padding: 5px 12px;
          border-radius: 16px;
          font-size: 10px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
        }

        .meme-time {
          font-size: 10px;
          color: #555;
        }

        .meme-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .meme-emoji {
          font-size: 56px;
          margin-bottom: 12px;
        }

        .meme-chaos {
          font-size: 34px;
          font-weight: 800;
          color: white;
          line-height: 1.15;
        }

        .meme-chaos .highlight {
          color: #ef4444;
        }

        .meme-subtext {
          font-size: 13px;
          color: #666;
          margin-top: 10px;
          max-width: 240px;
        }

        .meme-stats {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .meme-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 16px;
          text-align: center;
        }

        .meme-stat-value {
          font-size: 22px;
          font-weight: 700;
          color: white;
        }

        .meme-stat-label {
          font-size: 9px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 2px;
        }

        .meme-ship-box {
          margin-top: 20px;
          padding: 12px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(139, 92, 246, 0.08));
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          width: 100%;
          max-width: 260px;
        }

        .meme-ship-name {
          font-size: 15px;
          font-weight: 600;
          color: white;
        }

        .meme-ship-joke {
          font-size: 11px;
          color: #666;
          margin-top: 3px;
        }

        .meme-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .meme-cta {
          font-size: 11px;
          color: #666;
        }

        .meme-url {
          font-size: 9px;
          color: #444;
        }
      ` }} />
    </div>
  );
}

// ========== Card Components ==========

function KpopClassicCard({ userName, koreanName, idolName, idolNameKr, groupName, chemistry, chemistryTier, tierEmoji, stars, shipName, memberEmoji, fandomEmoji, fandomMessage, isLightTheme }: any) {
  return (
    <>
      <span className="classic-bg-emoji">{memberEmoji}</span>
      <span className="classic-sparkle">✨</span>
      <span className="classic-sparkle">{fandomEmoji}</span>
      <span className="classic-sparkle">⭐</span>
      <span className="classic-sparkle">✨</span>
      
      <div className="classic-content">
        <div className="classic-header">K-Pop Chemistry Test</div>
        
        <div className="classic-emoji">{memberEmoji}</div>
        
        <div className="classic-tier-badge">{tierEmoji} {chemistryTier.toUpperCase()} {tierEmoji}</div>
        
        <div className="classic-chem-label">Our Chemistry</div>
        <div className="classic-score">{chemistry}%</div>
        <div className="classic-stars">{stars}</div>
        
        <div className="classic-names">
          <div className="classic-user-name">{userName}</div>
          <div className="classic-heart">{fandomEmoji}</div>
          <div className="classic-idol-name">{idolName}</div>
          <div className="classic-idol-kr">{idolNameKr}</div>
        </div>
        
        <div className="classic-ship-section">
          <div className="classic-ship-label">Our Ship Name</div>
          <div className="classic-ship-box">
            <div className="classic-ship-main">{shipName.korean} {memberEmoji}</div>
            <div className="classic-ship-sub">{shipName.english}</div>
          </div>
          <div className="classic-hashtags">#{idolName.replace(/\s+/g, '')}Soulmate #{groupName.replace(/\s+/g, '')}Love</div>
        </div>
        
        <div className="classic-footer">
          <div className="classic-fandom-msg">{fandomMessage}</div>
          <div className="classic-url">kpopnamegenerator.com</div>
        </div>
      </div>
    </>
  );
}

function DarkCard({ userName, koreanName, idolName, idolNameKr, chemistry, chemistryTier, tierEmoji, shipName, memberEmoji, fandomEmoji }: any) {
  return (
    <>
      <div className="dark-gradient" />
      <div className="dark-inner">
        <div className="dark-tag">Chemistry Result</div>
        
        <div className="dark-main">
          <div className="dark-emoji">{memberEmoji}</div>
          <div className="dark-tier">{tierEmoji} {chemistryTier.toUpperCase()} {tierEmoji}</div>
          <div className="dark-score">{chemistry}<span className="dark-score-suffix">%</span></div>
          
          <div className="dark-pairing">
            <div className="dark-name">
              <div className="dark-name-en">{userName}</div>
              <div className="dark-name-kr">{koreanName}</div>
            </div>
            <div className="dark-heart">{fandomEmoji}</div>
            <div className="dark-name">
              <div className="dark-name-en">{idolName}</div>
              <div className="dark-name-kr">{idolNameKr}</div>
            </div>
          </div>
          
          <div className="dark-ship">
            <div className="dark-ship-label">Ship Name</div>
            <div className="dark-ship-name">{shipName.korean} {memberEmoji}</div>
            <div className="dark-ship-sub">"{shipName.english}"</div>
          </div>
        </div>
        
        <div className="dark-footer">
          <div className="dark-cta">test your chemistry →</div>
          <div className="dark-url">kpopnamegenerator.com</div>
        </div>
      </div>
    </>
  );
}

function Y2KCard({ userName, koreanName, idolName, idolNameKr, groupName, chemistry, chemistryTier, tierEmoji, shipName, memberEmoji }: any) {
  return (
    <div className="y2k-inner">
      <div className="y2k-badge">Soulmate Match</div>
      
      <div className="y2k-glass">
        <div className="y2k-emoji-row">
          <span>{memberEmoji}</span>
          <span>💗</span>
          <span>✨</span>
        </div>
        
        <div className="y2k-score-section">
          <div className="y2k-score-label">Chemistry Score</div>
          <div className="y2k-score-big">{chemistry}%</div>
          <div className="y2k-tier">{tierEmoji} {chemistryTier.toUpperCase()} {tierEmoji}</div>
        </div>
        
        <div className="y2k-names">
          <div className="y2k-name-line">
            {userName} <span className="heart">♡</span> {idolName}
          </div>
          
          <div className="y2k-korean-box">
            <div className="y2k-korean-label">My K-Name</div>
            <div className="y2k-korean-text">{koreanName}</div>
          </div>
        </div>
        
        <div className="y2k-ship">
          <div className="y2k-ship-title">Our Ship Name</div>
          <div className="y2k-ship-content">{shipName.korean} {memberEmoji} {shipName.english}</div>
          <div className="y2k-hashtag">#{idolName.replace(/\s+/g, '')}Soulmate #{groupName.replace(/\s+/g, '')}Fan</div>
        </div>
      </div>
      
      <div className="y2k-footer">
        <div className="y2k-url">kpopnamegenerator.com</div>
      </div>
    </div>
  );
}

function MemeCard({ userName, koreanName, idolName, chemistry, chemistryTier, shipName, memberEmoji }: any) {
  return (
    <div className="meme-inner">
      <div className="meme-top">
        <div className="meme-pill">Unhinged</div>
        <div className="meme-time">just now</div>
      </div>
      
      <div className="meme-main">
        <div className="meme-emoji">{memberEmoji}</div>
        <div className="meme-chaos">
          {idolName} is<br/>
          <span className="highlight">{chemistry}%</span><br/>
          my person
        </div>
        <div className="meme-subtext">
          I don't make the rules, the algorithm does 🤷‍♀️
        </div>
        
        <div className="meme-stats">
          <div className="meme-stat">
            <div className="meme-stat-value">{chemistry}%</div>
            <div className="meme-stat-label">Chemistry</div>
          </div>
          <div className="meme-stat">
            <div className="meme-stat-value">{chemistryTier.slice(0, 4).toUpperCase()}</div>
            <div className="meme-stat-label">Tier</div>
          </div>
        </div>
        
        <div className="meme-ship-box">
          <div className="meme-ship-name">{shipName.korean} {memberEmoji}</div>
          <div className="meme-ship-joke">literally me being their soulmate rn</div>
        </div>
      </div>
      
      <div className="meme-bottom">
        <div className="meme-cta">go get your results bestie</div>
        <div className="meme-url">kpopnamegenerator.com</div>
      </div>
    </div>
  );
}
