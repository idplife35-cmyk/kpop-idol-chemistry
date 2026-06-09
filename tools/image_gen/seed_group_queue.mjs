#!/usr/bin/env node
/**
 * Auto-seed the ChatGPT image-generation queue with one concept illustration
 * per K-Pop group, sourced from src/content/groups/*.json.
 *
 * Strategy decided in meetings/2026-06-09-image-strategy.md:
 *   - NO real-person photos, NO AI lookalikes (TEAM.md forbidden items).
 *   - Group-level concept illustrations only.
 *   - Member visuals = SVG abstract avatars rendered in MemberGrid.astro.
 *
 * Each generated queue file:
 *   tools/image_gen/queue/g{NN}-{slug}.json
 *
 * Output PNGs land at public/images/groups/{slug}-hero.png after image_gen runs.
 *
 * Usage:
 *   node seed_group_queue.mjs                  # write new queue files
 *   node seed_group_queue.mjs --force          # overwrite even if file exists
 *   node seed_group_queue.mjs --dry-run        # print prompts, write nothing
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GROUPS_DIR = path.join(REPO_ROOT, 'src', 'content', 'groups');
const QUEUE_DIR = path.join(__dirname, 'queue');

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const DRY_RUN = args.has('--dry-run');

// 1st-tribe groups get priority numbering so they generate first if quota runs out.
const PRIORITY_4G_5G = [
  'newjeans', 'ive', 'aespa', 'le-sserafim', 'riize', 'zerobaseone',
  'plave', 'katseye', 'illit', 'enhypen', 'txt',
];
const PRIORITY_1G = ['bts', 'blackpink', 'twice', 'seventeen', 'stray-kids'];

async function main() {
  const files = (await fs.readdir(GROUPS_DIR)).filter((f) => f.endsWith('.json'));
  const groups = [];
  for (const f of files) {
    const json = JSON.parse(await fs.readFile(path.join(GROUPS_DIR, f), 'utf8'));
    groups.push(json);
  }
  groups.sort(prioritySort);

  await fs.mkdir(QUEUE_DIR, { recursive: true });
  let written = 0;
  let skipped = 0;

  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const num = String(i + 10).padStart(2, '0'); // start at 10 so user's 01-05 stays
    const file = path.join(QUEUE_DIR, `g${num}-${g.slug}.json`);
    const exists = await fileExists(file);
    if (exists && !FORCE) {
      skipped++;
      continue;
    }
    const payload = buildQueueEntry(g, num);
    if (DRY_RUN) {
      console.log(`\n# ${file}\n${JSON.stringify(payload, null, 2)}`);
    } else {
      await fs.writeFile(file, JSON.stringify(payload, null, 2));
      written++;
    }
  }
  console.log(`\n[seed_group_queue] wrote=${written} skipped=${skipped} total=${groups.length} (dry-run=${DRY_RUN})`);
}

function prioritySort(a, b) {
  const at = tierRank(a.slug);
  const bt = tierRank(b.slug);
  if (at !== bt) return at - bt;
  return a.slug.localeCompare(b.slug);
}

function tierRank(slug) {
  if (PRIORITY_4G_5G.includes(slug)) return 1;
  if (PRIORITY_1G.includes(slug)) return 2;
  return 3;
}

function buildQueueEntry(group, num) {
  const memberCount = group.members?.length ?? 0;
  const fandom = group.fandom ? `Fandom: ${group.fandom}.` : '';
  const company = group.company ? `Label: ${group.company}.` : '';
  const desc = group.description ? group.description.replace(/\s+/g, ' ').trim() : '';
  const color = group.color || '#a855f7';
  const mood = inferMood(group);

  // Critical: no real-person prompts. Hard-code the safety preamble.
  const prompt = [
    `A concept illustration hero banner for the K-Pop group "${group.name}".`,
    '',
    'STRICT RULES (do not violate):',
    '- Absolutely NO depictions of real people, no faces resembling any real K-Pop idol.',
    '- No identifiable celebrity likeness. No text overlays.',
    '- Symbolic / abstract / world-building only — think album-cover artwork, not portraits.',
    '',
    'Scene direction:',
    `- Group identity cues: ${memberCount} members. ${fandom} ${company}`.trim(),
    `- Aesthetic & mood: ${mood}`,
    `- Primary brand color: ${color} — make this dominant or recurring.`,
    desc ? `- Story hook from canon: ${desc}` : '',
    '- Composition: 1.91:1 widescreen, soft negative space on one side for future text overlay.',
    '- Render with a fan-zine / poster / dreamy illustration feel — slightly imperfect, hand-illustrated, not photo-realistic.',
    '- Include symbolic props or motifs (instruments, sparkles, fandom totems, scenery) rather than human figures.',
    '',
    'Output: one image only.',
  ].filter(Boolean).join('\n');

  return {
    id: `${group.slug}-hero`,
    out: `public/images/groups/${group.slug}-hero.png`,
    size: '1792x1024',
    priority: num,
    style: 'Symbolic concept poster, no real-person likeness',
    prompt,
    notes: `Seeded ${new Date().toISOString().slice(0, 10)} from src/content/groups/${group.slug}.json. Image policy: meetings/2026-06-09-image-strategy.md.`,
  };
}

function inferMood(group) {
  const moods = {
    bts: 'Purple cosmic dream, mature artistry, BTS Universe storytelling',
    blackpink: 'Black + neon pink, fierce empowerment, runway grit',
    'le-sserafim': 'Fearless monochrome with hot accents, mythic warrior poise',
    newjeans: 'Y2K pastel summer, denim, bunnies, retro polaroid stack',
    ive: 'Pearlescent diamond luxe, magenta-pink shimmer, gilded edges',
    aespa: 'Synk cyber-fantasy, butterflies, dimensional portals, neo-future',
    riize: 'Sunrise orange-blue gradient, optimism, surfing motifs',
    zerobaseone: 'Sapphire blue beginnings, gentle gems, soft cyber halo',
    plave: 'Virtual fantasy stage, metaverse glow, mythic concert hall',
    katseye: 'Global mosaic, hot pink + multicultural symbols, world map',
    illit: 'Pastel Y2K soft-grunge, doll-house warmth, ribbons and stickers',
    enhypen: 'Gothic ENGENE vampires, midnight crimson, candlelight',
    txt: 'MOA blue dream-scape, soft cosmos, gentle wings',
    twice: 'Candy rainbow joy, lollipops, festival lights',
    seventeen: 'CARAT crystals, golden sparkle, geometric prism',
    'stray-kids': 'STAY storm-red urban, lightning, attitude posters',
    exo: 'EXO-L silver moonlight, ancient symbols, regal aura',
    'g-idle': 'Neverland purple-magic, mystical mirrors, sharp confidence',
    itzy: 'Hot magenta confetti, exclamation marks, MIDZY hearts',
    'red-velvet': 'Cake-and-velvet duality, dessert table dreamscape',
    nct127: 'NCTzen neon green, futuristic city, sci-fi cubes',
    ateez: 'Pirate adventure, atlas + compass, golden seas',
    txt: 'MOA blue, dreamcatcher wings',
    huntrix: 'Mythic predator silhouette, dark teal, hunter compass',
    sajaboys: 'Lion banner, regal scarlet, traditional Korean motifs',
  };
  return moods[group.slug] || 'Modern K-Pop poster aesthetic, group brand color dominant, dreamy concept';
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
  console.error('[seed_group_queue] failed:', err);
  process.exit(1);
});
