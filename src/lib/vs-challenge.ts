/**
 * VS Challenge System
 * Creates shareable challenge links for chemistry battles
 */

export interface ChallengeData {
  // Challenger info
  challengerName: string;
  challengerScore: number;
  challengerKoreanName: string;
  // Idol info
  idolGroup: string;
  idolNameEn: string;
  idolNameKr: string;
  // Timestamp for uniqueness
  timestamp: number;
}

export interface VSResult {
  challenger: {
    name: string;
    score: number;
    koreanName: string;
  };
  friend: {
    name: string;
    score: number;
    koreanName: string;
  };
  idol: {
    nameEn: string;
    nameKr: string;
    group: string;
  };
  winner: 'challenger' | 'friend' | 'tie';
  scoreDiff: number;
}

/**
 * Encode challenge data to base64 URL-safe string
 */
export function encodeChallengeData(data: ChallengeData): string {
  try {
    const json = JSON.stringify(data);
    // Use btoa for encoding, make URL-safe
    const base64 = btoa(encodeURIComponent(json));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Error encoding challenge:', e);
    return '';
  }
}

/**
 * Decode challenge data from URL parameter
 */
export function decodeChallengeData(encoded: string): ChallengeData | null {
  try {
    // Restore base64 format
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    const json = decodeURIComponent(atob(base64));
    return JSON.parse(json) as ChallengeData;
  } catch (e) {
    console.error('Error decoding challenge:', e);
    return null;
  }
}

/**
 * Create a challenge URL for sharing
 */
export function createChallengeUrl(data: ChallengeData): string {
  const encoded = encodeChallengeData(data);
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://kpopnamegenerator.com';
  return `${baseUrl}?vs=${encoded}`;
}

/**
 * Extract challenge data from current URL
 */
export function getChallengeFromUrl(): ChallengeData | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const vs = params.get('vs');
  
  if (!vs) return null;
  return decodeChallengeData(vs);
}

/**
 * Shorten a URL using TinyURL API
 */
export async function shortenUrl(longUrl: string): Promise<string> {
  try {
    // Use TinyURL's simple API (no auth required)
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
    );
    
    if (!response.ok) throw new Error('Failed to shorten URL');
    
    const shortUrl = await response.text();
    return shortUrl.trim();
  } catch (error) {
    console.error('URL shortening failed:', error);
    // Fall back to original URL
    return longUrl;
  }
}

/**
 * Create a shortened challenge URL for sharing
 */
export async function createShortChallengeUrl(data: ChallengeData): Promise<string> {
  const longUrl = createChallengeUrl(data);
  return shortenUrl(longUrl);
}

/**
 * Determine the winner of a VS battle
 */
export function determineWinner(
  challengerScore: number,
  friendScore: number
): 'challenger' | 'friend' | 'tie' {
  if (challengerScore > friendScore) return 'challenger';
  if (friendScore > challengerScore) return 'friend';
  return 'tie';
}

/**
 * Generate VS result for display
 */
export function generateVSResult(
  challenge: ChallengeData,
  friendName: string,
  friendScore: number,
  friendKoreanName: string
): VSResult {
  const winner = determineWinner(challenge.challengerScore, friendScore);
  const scoreDiff = Math.abs(challenge.challengerScore - friendScore);

  return {
    challenger: {
      name: challenge.challengerName,
      score: challenge.challengerScore,
      koreanName: challenge.challengerKoreanName,
    },
    friend: {
      name: friendName,
      score: friendScore,
      koreanName: friendKoreanName,
    },
    idol: {
      nameEn: challenge.idolNameEn,
      nameKr: challenge.idolNameKr,
      group: challenge.idolGroup,
    },
    winner,
    scoreDiff,
  };
}

/**
 * Generate share text for VS result
 */
export function generateVSShareText(result: VSResult): string {
  const winnerName = result.winner === 'challenger' 
    ? result.challenger.name 
    : result.winner === 'friend' 
      ? result.friend.name 
      : null;

  if (result.winner === 'tie') {
    return `⚡️ CHEMISTRY BATTLE TIE! ⚡️

${result.challenger.name} vs ${result.friend.name}
Both got ${result.challenger.score}% with ${result.idol.nameEn}! 🤯

Who's the real soulmate? Test yours:
kpopnamegenerator.com

#kpop #${result.idol.group.replace(/\s+/g, '')}`;
  }

  return `⚡️ CHEMISTRY BATTLE! ⚡️

🏆 Winner: ${winnerName}!

${result.challenger.name}: ${result.challenger.score}%
${result.friend.name}: ${result.friend.score}%
${result.scoreDiff > 10 ? '💥 DESTROYED!' : '😬 Close call!'}

Who wins against ${result.idol.nameEn}? Test yours:
kpopnamegenerator.com

#kpop #${result.idol.group.replace(/\s+/g, '')}`;
}

