#!/usr/bin/env node
/**
 * tools/image_queue.json 시드 생성기.
 *
 * 24개 그룹 × 2종(hero, logo) = 48 entries.
 *   - hero: 1200×630 WebP, < 80KB (목표). public/images/groups/{slug}-hero.webp
 *   - logo: 240×120 PNG, 투명 배경.    public/images/groups/{slug}-logo.png
 *
 * 우선순위는 product/image-plan-2026-06-15.md 의 P0/P1/P2 분류를 따른다.
 * 그룹 색상도 image-plan을 우선 적용한다(JSON의 color와 다를 수 있음 — 계획이 정합 기준).
 *
 * Usage:
 *   node tools/seed_image_queue.mjs
 *   node tools/seed_image_queue.mjs --force      # 기존 image_queue.json 덮어쓰기
 *   node tools/seed_image_queue.mjs --dry-run    # 출력만, 파일 작성 안 함
 *
 * 절대 금기:
 *   - 실인물 묘사·실명 추가·photorealistic person 금지
 *   - "draw {idol_name}" 류 절대 금지
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const GROUPS_DIR = path.join(REPO_ROOT, 'src', 'content', 'groups');
const QUEUE_PATH = path.join(__dirname, 'image_queue.json');

const FORCE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');

// product/image-plan-2026-06-15.md 의 priority + color 매핑.
// (JSON의 color와 다를 수 있는데, 계획 문서가 정합 기준.)
const PLAN = {
  // P0 — 부족 핵심 8그룹
  bts:          { priority: 'p0', color: '#7B2B8F', emoji: '💜' },
  newjeans:     { priority: 'p0', color: '#5B9BD5', emoji: '👖' },
  ive:          { priority: 'p0', color: '#FFB6C1', emoji: '💗' },
  blackpink:    { priority: 'p0', color: '#FF007F', emoji: '🖤' },
  zerobaseone:  { priority: 'p0', color: '#1F75FE', emoji: '💎' },
  aespa:        { priority: 'p0', color: '#9966FF', emoji: '🌐' },
  'le-sserafim':{ priority: 'p0', color: '#000000', emoji: '🔥' },
  katseye:      { priority: 'p0', color: '#FF4F8B', emoji: '🌟' },
  // P1 — 안정 트래픽 8그룹
  'stray-kids': { priority: 'p1', color: '#FF3333', emoji: '🖤' },
  twice:        { priority: 'p1', color: '#FF5FA2', emoji: '🍭' },
  seventeen:    { priority: 'p1', color: '#F8C8DC', emoji: '💎' },
  riize:        { priority: 'p1', color: '#FF8C00', emoji: '🌟' },
  plave:        { priority: 'p1', color: '#6B5B95', emoji: '🎭' },
  itzy:         { priority: 'p1', color: '#FF3366', emoji: '✨' },
  enhypen:      { priority: 'p1', color: '#FF6B35', emoji: '🦇' },
  txt:          { priority: 'p1', color: '#0ABAB5', emoji: '🦋' },
  // P2 — 롱테일 8그룹
  exo:          { priority: 'p2', color: '#C0C0C0', emoji: '👑' },
  ateez:        { priority: 'p2', color: '#0066CC', emoji: '⚓' },
  nct127:       { priority: 'p2', color: '#00FF00', emoji: '🌿' },
  'red-velvet': { priority: 'p2', color: '#FF0000', emoji: '🍰' },
  'g-idle':     { priority: 'p2', color: '#9B59B6', emoji: '🔮' },
  illit:        { priority: 'p2', color: '#FFD8E4', emoji: '🌷' },
  huntrix:      { priority: 'p2', color: '#2C3E50', emoji: '🎯' },
  sajaboys:     { priority: 'p2', color: '#E74C3C', emoji: '🦁' },
};

// 팬덤 분위기 매핑 (image-plan + tribe/worldview-v1 종합).
// 실인물 묘사 금지. 분위기·모티프만.
const FANDOM_MOOD = {
  bts:           'global unity, purple wave, microphones in motion',
  newjeans:      'Y2K nostalgia, denim and pastel, bunny silhouettes, retro polaroid',
  ive:           'sparkle, pearl tones, runway energy, diamond shimmer',
  blackpink:     'rose petals, black leather, neon stage, fierce empowerment',
  zerobaseone:   'starlight blue, debut sparkle, gentle gems, soft cyber halo',
  aespa:         'metaverse glitch, neon cyber, dimensional portals, butterflies',
  'le-sserafim': 'fire spark, fearless silhouette, mythic warrior poise',
  katseye:       'global eyes, pink starlight, multicultural mosaic, world map',
  'stray-kids':  'storm-red urban energy, lightning bolts, graffiti attitude',
  twice:         'candy rainbow joy, lollipops, festival lights, pastel hearts',
  seventeen:     'crystal geometric prism, soft pink sparkle, thirteen-point composition',
  riize:         'sunrise orange-blue gradient, optimism, surfing motifs',
  plave:         'virtual fantasy stage, metaverse glow, mythic concert hall',
  itzy:          'hot magenta confetti, exclamation marks, bold heart shapes',
  enhypen:       'gothic vampire dusk, midnight crimson, candlelight',
  txt:           'MOA blue dreamscape, soft cosmos, gentle wings',
  exo:           'silver moonlight, ancient symbols, regal aura, twelve constellations',
  ateez:         'pirate adventure, atlas and compass, golden seas',
  nct127:        'neon green futuristic city, sci-fi cubes, urban grid',
  'red-velvet':  'cake-and-velvet duality, dessert table dreamscape, scarlet ribbon',
  'g-idle':      'Neverland purple magic, mystical mirrors, sharp confidence',
  illit:         'pastel Y2K soft-grunge, dollhouse warmth, ribbons and stickers',
  huntrix:       'mythic predator silhouette, dark teal, hunter compass, fantasy aura',
  sajaboys:     'lion banner, regal scarlet, traditional Korean motifs',
};

async function main() {
  // 기존 큐 보호
  if (!FORCE && !DRY_RUN) {
    const exists = await fileExists(QUEUE_PATH);
    if (exists) {
      console.error(`[seed] ${QUEUE_PATH} 가 이미 존재합니다. --force 로 덮어쓰기 가능.`);
      process.exit(1);
    }
  }

  const files = (await fs.readdir(GROUPS_DIR)).filter((f) => f.endsWith('.json'));
  const groups = [];
  for (const f of files) {
    const json = JSON.parse(await fs.readFile(path.join(GROUPS_DIR, f), 'utf8'));
    groups.push(json);
  }

  // 누락된 그룹 검출
  const known = new Set(Object.keys(PLAN));
  const seen = new Set(groups.map((g) => g.slug));
  const missingFromPlan = [...seen].filter((s) => !known.has(s));
  const missingFromJson  = [...known].filter((s) => !seen.has(s));
  if (missingFromPlan.length) {
    console.warn('[seed] PLAN에 없는 그룹(JSON에는 있음):', missingFromPlan.join(', '));
  }
  if (missingFromJson.length) {
    console.warn('[seed] JSON에 없는 그룹(PLAN에는 있음):', missingFromJson.join(', '));
  }

  // 우선순위 → 그룹 정렬
  groups.sort((a, b) => {
    const pa = PLAN[a.slug]?.priority || 'p9';
    const pb = PLAN[b.slug]?.priority || 'p9';
    if (pa !== pb) return pa.localeCompare(pb);
    return a.slug.localeCompare(b.slug);
  });

  const queue = [];
  for (const g of groups) {
    const plan = PLAN[g.slug];
    if (!plan) {
      console.warn(`[seed] ${g.slug} PLAN 매핑 없음 — 스킵.`);
      continue;
    }
    const color = plan.color;
    const emoji = plan.emoji;
    const mood = FANDOM_MOOD[g.slug] || 'modern K-Pop poster aesthetic, brand color dominant';
    const fandom = g.fandom || 'fans';
    const priority = plan.priority;

    // Hero entry
    queue.push({
      id: `${g.slug}-hero`,
      type: 'hero',
      priority,
      group: g.name,
      slug: g.slug,
      color,
      emoji,
      fandom,
      prompt: buildHeroPrompt({ name: g.name, fandom, color, mood }),
      outputPath: `public/images/groups/${g.slug}-hero.webp`,
      status: 'pending',
      attempts: 0,
    });
    // Logo entry
    queue.push({
      id: `${g.slug}-logo`,
      type: 'logo',
      priority,
      group: g.name,
      slug: g.slug,
      color,
      emoji,
      fandom,
      prompt: buildLogoPrompt({ name: g.name, color }),
      outputPath: `public/images/groups/${g.slug}-logo.png`,
      status: 'pending',
      attempts: 0,
    });
  }

  if (DRY_RUN) {
    console.log(JSON.stringify(queue, null, 2));
  } else {
    await fs.writeFile(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');
  }

  const counts = queue.reduce((acc, e) => {
    acc[e.priority] = (acc[e.priority] || 0) + 1;
    return acc;
  }, {});
  console.log(`[seed] entries=${queue.length} (p0=${counts.p0 || 0} p1=${counts.p1 || 0} p2=${counts.p2 || 0}) dry-run=${DRY_RUN}`);
}

function buildHeroPrompt({ name, fandom, color, mood }) {
  // 안전 가드: 실인물·실명·photorealistic person 금지.
  return [
    `Fan zine illustration poster for K-Pop group "${name}" (${fandom} fandom).`,
    `Style: hand-drawn, slightly imperfect, fanzine aesthetic, not glossy.`,
    `NO real human faces, NO photorealistic people. Abstract silhouettes or symbolic elements only.`,
    `Color palette dominant: ${color}. Mood: ${mood}.`,
    `Format: 1200x630 wide poster, atmospheric, no text overlay.`,
  ].join('\n');
}

function buildLogoPrompt({ name, color }) {
  return [
    `Graphic typography of the text "${name}", custom hand-drawn lettering, monoline style,`,
    `transparent background, ${color} accent color, no extra decoration, no real brand logo references.`,
  ].join(' ');
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

main().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
