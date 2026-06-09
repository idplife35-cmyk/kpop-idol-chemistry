/**
 * GA4 Event Tracking Helpers
 *
 * Defines the 5 conversion events tracked for the 3-month ad-revenue mission.
 * See: ~/project/my-assistant/pipeline/kpop-name-generator.md
 *      ~/project/kpop-idol-chemistry/analytics/baseline-2026-06-09.md
 *
 * Mark these as Key Events in GA4 Admin → Events to make them count as conversions.
 */

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      eventName: string,
      eventParams?: Record<string, unknown>
    ) => void;
  }
}

function track(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', eventName, params);
  } catch (err) {
    console.error('GA event failed:', eventName, err);
  }
}

export function trackNameGenerated(params: {
  group: string;
  idolName: string;
  chemistry: number;
  tier: string;
  relation: string;
  isReroll?: boolean;
}): void {
  track('name_generated', {
    group: params.group,
    idol_name: params.idolName,
    chemistry: params.chemistry,
    chemistry_tier: params.tier,
    relation: params.relation,
    is_reroll: params.isReroll ? 1 : 0,
  });
}

export function trackVsChallengeCreated(params: {
  group: string;
  idolName: string;
  challengerScore: number;
}): void {
  track('vs_challenge_created', {
    group: params.group,
    idol_name: params.idolName,
    challenger_score: params.challengerScore,
  });
}

export function trackVsBattleResolved(params: {
  group: string;
  idolName: string;
  challengerScore: number;
  friendScore: number;
  winner: 'challenger' | 'friend' | 'tie';
}): void {
  track('vs_battle_resolved', {
    group: params.group,
    idol_name: params.idolName,
    challenger_score: params.challengerScore,
    friend_score: params.friendScore,
    winner: params.winner,
  });
}

export function trackResultShared(params: {
  channel: 'twitter' | 'instagram' | 'kakao' | 'link_copy' | 'download_image' | 'other';
  cardStyle?: 'classic' | 'dark' | 'y2k' | 'meme';
  group?: string;
  idolName?: string;
}): void {
  track('result_shared', {
    channel: params.channel,
    card_style: params.cardStyle ?? 'na',
    group: params.group ?? 'unknown',
    idol_name: params.idolName ?? 'unknown',
  });
}

export function trackFavoriteAdded(params: {
  group: string;
  idolName: string;
  chemistry?: number;
}): void {
  track('favorite_added', {
    group: params.group,
    idol_name: params.idolName,
    chemistry: params.chemistry ?? -1,
  });
}

export function trackPwaInstalled(params: { source: 'prompt' | 'banner' | 'browser' }): void {
  track('pwa_installed', { source: params.source });
}
