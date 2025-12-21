/**
 * Style presets by relation type.
 * These presets guide how the Styled name should be formed.
 */

export interface RelationPreset {
  targetLen: number[];
  preferSoft: boolean;
  preferElegant: boolean;
}

export type RelationType = 'friend' | 'partner' | 'classmate' | 'drama' | 'lover' | 'rival' | 'sibling' | 'soulmate';

export const RELATION_PRESET: Record<RelationType, RelationPreset> = {
  // 절친: 밝고 친근한 느낌
  friend: { targetLen: [2, 3], preferSoft: true, preferElegant: false },

  // 무대 파트너: 파워/카리스마
  partner: { targetLen: [2, 3], preferSoft: false, preferElegant: false },

  // 같은 반 친구: 일상/따뜻
  classmate: { targetLen: [2], preferSoft: true, preferElegant: true },

  // 드라마 주인공: 로맨틱/운명적
  drama: { targetLen: [2, 3], preferSoft: true, preferElegant: true },

  // 애인: 달달/세련/우아
  lover: { targetLen: [2, 3], preferSoft: true, preferElegant: true },

  // 라이벌: 강렬/카리스마
  rival: { targetLen: [2, 3], preferSoft: false, preferElegant: false },

  // 형제/자매: 친근/가족
  sibling: { targetLen: [2], preferSoft: true, preferElegant: false },

  // 소울메이트: 운명적/유려
  soulmate: { targetLen: [2, 3], preferSoft: true, preferElegant: true }
};

export function getPreset(relation: RelationType): RelationPreset {
  return RELATION_PRESET[relation] || RELATION_PRESET.lover;
}

export const RELATION_OPTIONS: { value: RelationType; label: string; emoji: string }[] = [
  { value: 'lover', label: 'Lover', emoji: '💕' },
  { value: 'friend', label: 'Best Friend', emoji: '🤝' },
  { value: 'soulmate', label: 'Soulmate', emoji: '✨' },
  { value: 'partner', label: 'Stage Partner', emoji: '🎤' },
  { value: 'drama', label: 'Drama Lead', emoji: '🎬' },
  { value: 'rival', label: 'Rival', emoji: '⚔️' },
  { value: 'sibling', label: 'Sibling', emoji: '👨‍👩‍👧' },
  { value: 'classmate', label: 'Classmate', emoji: '📚' }
];

