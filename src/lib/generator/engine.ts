/**
 * Name Generation Engine v2
 * 개선된 한국 이름 생성 알고리즘
 * 
 * 개선사항:
 * 1. 자연스러운 이름 조합 데이터베이스 사용
 * 2. 같은 입력이어도 다른 결과를 얻을 수 있는 variation 옵션
 * 3. "같은 이름" 기능도 실제 다른 이름 생성 (단순 성만 바꾸기 X)
 * 4. 2글자 이름 중심 (한국 이름의 표준)
 */

import { makeSeed, rnd } from './seed';
import { romanize } from './romanize';
import { RELATION_PRESET, type RelationType } from './style-presets';
import { NATURAL_NAMES, getNaturalSecond, isNaturalCombination } from './korean-names';
import surnamesData from '@/data/surnames.json';

export interface IdolInfo {
  group: string;
  name_kr: string;
  name_en: string;
  gender: 'male' | 'female';
}

export interface GeneratorOptions {
  myName: string;
  idol: IdolInfo;
  genderPref?: 'auto' | 'male' | 'female';
  relation?: RelationType;
  variation?: number; // 0-9, 같은 입력으로 다른 결과 생성
}

export interface GeneratorResult {
  seed: number;
  finalGender: 'male' | 'female';
  chemistry: number;
  sameName: {
    full_kr: string;
    full_en: string;
  };
  styled: {
    full_kr: string;
    full_en: string;
  };
  variation: number;
}

// Get surnames from JSON
function getSurnames(): string[] {
  return surnamesData as string[];
}

// 한글 자모 분리 (초성 추출용)
const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGSUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];

function getChosung(char: string): string {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return '';
  return CHOSUNG[Math.floor(code / 588)];
}

function getJungsung(char: string): string {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return '';
  return JUNGSUNG[Math.floor((code % 588) / 28)];
}

// Infer gender from name
export function inferGender(myName: string): 'male' | 'female' | null {
  if (!myName) return null;
  
  const n = (myName || '').toLowerCase();
  const female = ['sophia', 'emma', 'olivia', 'ava', 'mia', 'isabella', 'sofia', 'emily', 'chloe', 'grace', 'lily', 'sarah', 'jessica', 'jennifer', 'ashley', 'amanda', 'stephanie'];
  const male = ['daniel', 'david', 'michael', 'james', 'john', 'william', 'henry', 'liam', 'noah', 'jacob', 'matthew', 'andrew', 'ryan', 'brian', 'kevin', 'joshua'];
  
  if (female.includes(n)) return 'female';
  if (male.includes(n)) return 'male';
  
  // Korean name detection
  if (/[가-힣]$/.test(myName)) {
    const last = myName[myName.length - 1];
    if ('아라연린예윤서나슬희진원빈'.includes(last)) return 'female';
    if ('준현석호민우혁훈영'.includes(last)) return 'male';
  }
  
  return null;
}

// Helper: 배열에서 시드 기반 선택
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

// 아이돌 이름에서 영감받은 음절 찾기
function getInspirationFromIdol(idolName: string, gender: 'male' | 'female'): { first: string; second: string } {
  const chars = [...idolName];
  const data = NATURAL_NAMES[gender];
  
  // 아이돌 이름의 첫 글자에서 영감
  let inspFirst = chars[0];
  
  // 해당 글자가 first에 없으면 비슷한 발음 찾기
  if (!data.first.includes(inspFirst)) {
    const chosung = getChosung(inspFirst);
    // 같은 초성으로 시작하는 음절 찾기
    const similar = data.first.find(f => getChosung(f) === chosung);
    inspFirst = similar || data.first[0];
  }
  
  // 두 번째 음절 찾기
  let inspSecond = chars.length > 1 ? chars[1] : '';
  if (!inspSecond || !data.second.includes(inspSecond)) {
    const options = getNaturalSecond(inspFirst, gender);
    inspSecond = options[0] || data.second[0];
  }
  
  return { first: inspFirst, second: inspSecond };
}

// 자연스러운 이름 생성
function generateNaturalName(
  seed: number, 
  gender: 'male' | 'female',
  inspiration?: { first: string; second: string }
): string {
  const data = NATURAL_NAMES[gender];
  const n1 = rnd(seed);
  const n2 = rnd(seed + 1);
  const n3 = rnd(seed + 2);
  
  // 30% 확률로 인기 이름에서 선택
  if (n3 % 10 < 3) {
    return pick(data.popular, n1);
  }
  
  // 영감이 있으면 그것을 기반으로
  let first: string;
  if (inspiration && n3 % 10 < 7) {
    // 70% 확률로 영감의 첫 글자 사용
    first = inspiration.first;
  } else {
    first = pick(data.first, n1);
  }
  
  // 자연스러운 두 번째 음절 선택
  const secondOptions = getNaturalSecond(first, gender);
  let second = pick(secondOptions, n2);
  
  // 영감의 두 번째 음절과 비슷한 것 선택 시도
  if (inspiration?.second && n3 % 10 < 4) {
    const jungsung = getJungsung(inspiration.second);
    const similar = secondOptions.find(s => getJungsung(s) === jungsung);
    if (similar) second = similar;
  }
  
  // 자연스러운 조합인지 확인, 아니면 재시도
  if (!isNaturalCombination(first, second, gender)) {
    // 인기 이름에서 선택
    return pick(data.popular, n1 + n2);
  }
  
  return first + second;
}

// Relation별 이름 스타일링 힌트
const RELATION_STYLE: Record<RelationType, { suffix?: string[]; vibe: 'cute' | 'cool' | 'elegant' }> = {
  lover: { vibe: 'cute' },
  rival: { vibe: 'cool' },
  sibling: { vibe: 'cute' },
  duo: { vibe: 'cool' },
  mentor: { vibe: 'elegant' }
};

// 스타일에 맞는 이름 생성
function generateStyledName(
  seed: number,
  gender: 'male' | 'female',
  relation: RelationType,
  inspiration: { first: string; second: string }
): string {
  const data = NATURAL_NAMES[gender];
  const style = RELATION_STYLE[relation] || RELATION_STYLE.lover;
  
  const n1 = rnd(seed);
  const n2 = rnd(seed + 1);
  const n3 = rnd(seed + 2);
  const n4 = rnd(seed + 3);
  
  // Vibe에 따른 음절 선호도
  let preferredFirsts: string[];
  let preferredSeconds: string[];
  
  if (style.vibe === 'cute') {
    preferredFirsts = gender === 'female' 
      ? ['유', '하', '나', '소', '예', '미', '서', '수', '아']
      : ['도', '시', '유', '하', '준', '민', '우', '서'];
    preferredSeconds = gender === 'female'
      ? ['아', '나', '린', '연', '희', '빈', '솔']
      : ['우', '호', '준', '빈', '민', '원'];
  } else if (style.vibe === 'cool') {
    preferredFirsts = gender === 'female'
      ? ['진', '현', '채', '시', '윤', '영', '지']
      : ['현', '재', '진', '성', '태', '승', '찬'];
    preferredSeconds = gender === 'female'
      ? ['현', '진', '윤', '원', '서', '영']
      : ['혁', '석', '호', '현', '훈', '민'];
  } else {
    preferredFirsts = gender === 'female'
      ? ['서', '혜', '수', '윤', '은', '정', '민']
      : ['준', '영', '정', '상', '원', '형', '윤'];
    preferredSeconds = gender === 'female'
      ? ['연', '윤', '희', '진', '원', '영']
      : ['현', '호', '영', '민', '원', '서'];
  }
  
  // 첫 번째 음절 선택 (영감 + 스타일 조합)
  let first: string;
  if (n4 % 10 < 4 && preferredFirsts.includes(inspiration.first)) {
    first = inspiration.first;
  } else if (n4 % 10 < 7) {
    first = pick(preferredFirsts, n1);
  } else {
    first = pick(data.first, n1);
  }
  
  // 두 번째 음절 선택
  const naturalSeconds = getNaturalSecond(first, gender);
  // 스타일 선호 음절과 자연스러운 조합의 교집합
  const styledSeconds = naturalSeconds.filter(s => preferredSeconds.includes(s));
  
  let second: string;
  if (styledSeconds.length > 0 && n4 % 10 < 7) {
    second = pick(styledSeconds, n2);
  } else {
    second = pick(naturalSeconds, n2);
  }
  
  // 자연스러운 조합 검증
  if (!isNaturalCombination(first, second, gender)) {
    return pick(data.popular, n1 + n2 + n3);
  }
  
  return first + second;
}

/**
 * Main generation function
 */
export function generate(options: GeneratorOptions): GeneratorResult {
  const { 
    myName, 
    idol, 
    genderPref = 'auto', 
    relation = 'lover',
    variation = 0 
  } = options;
  
  // Variation을 포함한 시드 생성
  const baseSeed = makeSeed(
    myName || '', 
    idol.group + ':' + idol.name_kr, 
    genderPref, 
    relation
  );
  const seed = baseSeed + (variation * 12345); // variation마다 다른 결과
  
  // Determine final gender
  const finalGender: 'male' | 'female' = 
    genderPref !== 'auto' 
      ? genderPref 
      : inferGender(myName) || idol.gender || 'female';
  
  // Get surnames
  const surnames = getSurnames();
  
  // Generate random numbers
  const n1 = rnd(seed);
  const n2 = rnd(seed + 100);
  const n3 = rnd(seed + 200);
  const n4 = rnd(seed + 300);
  
  // 아이돌 이름에서 영감 추출
  const inspiration = getInspirationFromIdol(idol.name_kr, finalGender);
  
  // ===== Same Name (비슷한 느낌의 다른 이름) =====
  // 단순히 성만 바꾸는 것이 아닌, 아이돌 이름에서 영감받은 새로운 이름
  const givenName1 = generateNaturalName(seed + 1000, finalGender, inspiration);
  const surname1 = pick(surnames, n1);
  const full1_kr = surname1 + givenName1;
  const full1_en = romanize(full1_kr);
  
  // ===== Styled Name (관계에 맞는 스타일의 이름) =====
  const givenName2 = generateStyledName(seed + 2000, finalGender, relation, inspiration);
  const surname2 = pick(surnames, n3);
  const full2_kr = surname2 + givenName2;
  const full2_en = romanize(full2_kr);
  
  // Chemistry score (70-100)
  // 약간의 변화를 주지만 기본적으로 높은 점수 유지
  const baseChemistry = 75 + (n4 % 20); // 75-94
  const bonusChance = n4 % 100;
  const chemistry = bonusChance < 15 ? 95 + (n4 % 6) : baseChemistry; // 15% 확률로 95-100
  
  return {
    seed,
    finalGender,
    chemistry,
    sameName: { full_kr: full1_kr, full_en: full1_en },
    styled: { full_kr: full2_kr, full_en: full2_en },
    variation
  };
}

/**
 * Get chemistry description based on score
 */
export function getChemistryDescription(score: number): { emoji: string; text: string; color: string } {
  if (score >= 95) return { emoji: '💘', text: 'Perfect Match!', color: '#FF2E8B' };
  if (score >= 90) return { emoji: '💖', text: 'Amazing Chemistry!', color: '#FF6B9D' };
  if (score >= 85) return { emoji: '💕', text: 'Great Match!', color: '#FF8FB1' };
  if (score >= 80) return { emoji: '💗', text: 'Good Chemistry!', color: '#FFB3C6' };
  return { emoji: '💜', text: 'Nice Match!', color: '#B490FF' };
}
