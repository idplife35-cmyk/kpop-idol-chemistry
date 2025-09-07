

/**
 * Style presets by relation type.
 * These presets guide how the Styled name should be formed:
 * - targetLen: desired syllable lengths (2 or 3)
 * - preferSoft: prefer softer vowels/consonants when mapping syllables
 * - preferElegant: prefer elegant/end syllables from pool when padding
 *
 * Note: Actual mapping is handled in engine.js (styleFrom), which
 * uses these hints together with syllable pools (syllables.json).
 */

export const RELATION_PRESET = {
  /**
   * 절친: 밝고 친근한 느낌, 2~3음절 균형
   */
  friend:   { targetLen: [2, 3], preferSoft: true,  preferElegant: false },

  /**
   * 무대 파트너: 파워/카리스마, 자음 강세 경향, 2~3음절
   */
  partner:  { targetLen: [2, 3], preferSoft: false, preferElegant: false },

  /**
   * 같은 반 친구: 일상/따뜻, 부드러운 톤, 2음절 선호
   */
  classmate:{ targetLen: [2],    preferSoft: true,  preferElegant: true  },

  /**
   * 드라마 주인공: 로맨틱/운명적, 유려한 모음, 2~3음절
   */
  drama:    { targetLen: [2, 3], preferSoft: true,  preferElegant: true  },

  /**
   * 애인: 달달/세련/우아, 2~3음절
   */
  lover:    { targetLen: [2, 3], preferSoft: true,  preferElegant: true  }
};

/**
 * Helper (optional): safely get preset; falls back to lover
 */
export function getPreset(relation){
  return RELATION_PRESET[relation] || RELATION_PRESET.lover;
}