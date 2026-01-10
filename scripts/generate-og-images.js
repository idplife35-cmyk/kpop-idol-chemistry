/**
 * OG Image Generator Script
 * Generates Open Graph images for all group and member pages at build time
 * 
 * Usage: node scripts/generate-og-images.js
 */

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Paths
const CONTENT_DIR = join(ROOT_DIR, 'src/content/groups');
const OUTPUT_DIR = join(ROOT_DIR, 'public/og');

// Colors for different groups (matches group themes)
const GROUP_THEMES = {
  bts: { bg: '#9333ea', accent: '#fbbf24', emoji: '💜' },
  blackpink: { bg: '#ec4899', accent: '#000000', emoji: '🖤' },
  newjeans: { bg: '#3b82f6', accent: '#22d3ee', emoji: '👖' },
  straykids: { bg: '#ef4444', accent: '#000000', emoji: '🦊' },
  seventeen: { bg: '#f472b6', accent: '#a855f7', emoji: '💎' },
  aespa: { bg: '#6366f1', accent: '#22d3ee', emoji: '✨' },
  twice: { bg: '#fb7185', accent: '#fda4af', emoji: '🍑' },
  itzy: { bg: '#f97316', accent: '#fbbf24', emoji: '⚡' },
  txt: { bg: '#0ea5e9', accent: '#38bdf8', emoji: '🦋' },
  enhypen: { bg: '#6366f1', accent: '#818cf8', emoji: '🌙' },
  ive: { bg: '#a855f7', accent: '#e879f9', emoji: '👑' },
  lesserafim: { bg: '#000000', accent: '#ffffff', emoji: '🔥' },
  nmixx: { bg: '#8b5cf6', accent: '#a78bfa', emoji: '🎵' },
  gidle: { bg: '#10b981', accent: '#34d399', emoji: '💚' },
  ateez: { bg: '#ef4444', accent: '#fbbf24', emoji: '🏴‍☠️' },
  exo: { bg: '#6b7280', accent: '#d1d5db', emoji: '🌟' },
  got7: { bg: '#22c55e', accent: '#4ade80', emoji: '🐥' },
  monstax: { bg: '#ef4444', accent: '#f87171', emoji: '🔴' },
  nct127: { bg: '#22c55e', accent: '#4ade80', emoji: '💚' },
  redvelvet: { bg: '#dc2626', accent: '#fb7185', emoji: '❤️' },
  treasuretrove: { bg: '#f59e0b', accent: '#fbbf24', emoji: '💎' },
  default: { bg: '#ff69b4', accent: '#ffb6c1', emoji: '💕' }
};

// Load font
async function loadFont() {
  // Try multiple font sources in order
  const fontPaths = [
    // 1. Installed @fontsource package
    join(ROOT_DIR, 'node_modules/@fontsource/rubik/files/rubik-latin-700-normal.woff'),
    // 2. Local fonts folder
    join(ROOT_DIR, 'public/fonts/Rubik-Bold.ttf'),
  ];
  
  for (const fontPath of fontPaths) {
    if (existsSync(fontPath)) {
      console.log(`📁 Loading font from: ${fontPath.replace(ROOT_DIR, '')}`);
      return readFileSync(fontPath);
    }
  }
  
  // Fallback: try to download
  try {
    console.log('⬇️  Downloading font from GitHub...');
    const response = await fetch('https://raw.githubusercontent.com/googlefonts/rubik/main/fonts/ttf/Rubik-Bold.ttf');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const fontBuffer = await response.arrayBuffer();
    return Buffer.from(fontBuffer);
  } catch (error) {
    throw new Error('No font available: ' + error.message);
  }
}

// Generate OG image for a group
function createGroupOGTemplate(groupName, memberCount, fandom, theme) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.bg} 0%, ${adjustColor(theme.bg, -30)} 100%)`,
        fontFamily: 'Rubik',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // Background pattern (stars instead of emoji)
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.15,
              fontSize: '60px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              letterSpacing: '40px',
            },
            children: Array(30).fill('*').join(' '),
          },
        },
        // Content
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
            children: [
              // Group name
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '80px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  },
                  children: groupName.toUpperCase(),
                },
              },
              // Subtitle
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '36px',
                    marginBottom: '24px',
                    opacity: 0.9,
                  },
                  children: 'Korean Name Generator',
                },
              },
              // Tagline
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '28px',
                    backgroundColor: theme.accent,
                    padding: '12px 32px',
                    borderRadius: '100px',
                    color: theme.bg === '#000000' ? 'black' : 'white',
                  },
                  children: `${memberCount} Members - Find Your K-Pop Soulmate!`,
                },
              },
              // Fandom
              fandom && {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    marginTop: '20px',
                    opacity: 0.8,
                  },
                  children: `For ${fandom}`,
                },
              },
            ].filter(Boolean),
          },
        },
        // Site branding
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '24px',
              right: '32px',
              fontSize: '20px',
              opacity: 0.7,
            },
            children: 'kpopnamegenerator.com',
          },
        },
      ],
    },
  };
}

// Generate OG image for a member
function createMemberOGTemplate(memberName, groupName, theme, memberInfo = {}) {
  const { mbti } = memberInfo;
  
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.bg} 0%, ${adjustColor(theme.bg, -30)} 100%)`,
        fontFamily: 'Rubik',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // Background pattern (hearts/stars)
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.12,
              fontSize: '50px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              letterSpacing: '30px',
            },
            children: Array(25).fill('*').join(' '),
          },
        },
        // Main content
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
            children: [
              // Member name
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '72px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  },
                  children: memberName,
                },
              },
              // Group name
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '32px',
                    marginBottom: '24px',
                    opacity: 0.9,
                  },
                  children: groupName.toUpperCase(),
                },
              },
              // MBTI badge (if available)
              mbti && {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '8px 24px',
                    borderRadius: '50px',
                    marginBottom: '16px',
                  },
                  children: `MBTI: ${mbti}`,
                },
              },
              // CTA
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '28px',
                    backgroundColor: theme.accent,
                    padding: '12px 32px',
                    borderRadius: '100px',
                    color: theme.bg === '#000000' ? 'black' : 'white',
                  },
                  children: 'Test Your Chemistry!',
                },
              },
            ].filter(Boolean),
          },
        },
        // Site branding
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '24px',
              right: '32px',
              fontSize: '20px',
              opacity: 0.7,
            },
            children: 'kpopnamegenerator.com',
          },
        },
      ],
    },
  };
}

// Utility: Adjust color brightness
function adjustColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Convert SATORI virtual DOM to PNG
async function generatePNG(template, font) {
  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Rubik',
        data: font,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const pngBuffer = await sharp(Buffer.from(svg))
    .png({ quality: 90, compressionLevel: 6 })
    .toBuffer();

  return pngBuffer;
}

// Main function
async function generateOGImages() {
  console.log('🖼️  Starting OG image generation...\n');

  // Load font
  let font;
  try {
    font = await loadFont();
    console.log('✅ Font loaded successfully\n');
  } catch (error) {
    console.error('❌ Failed to load font:', error.message);
    process.exit(1);
  }

  // Create output directories
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const groupsDir = join(OUTPUT_DIR, 'groups');
  const membersDir = join(OUTPUT_DIR, 'members');
  if (!existsSync(groupsDir)) mkdirSync(groupsDir, { recursive: true });
  if (!existsSync(membersDir)) mkdirSync(membersDir, { recursive: true });

  // Read all group JSON files
  const groupFiles = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));
  
  let totalGroups = 0;
  let totalMembers = 0;

  for (const file of groupFiles) {
    const groupData = JSON.parse(readFileSync(join(CONTENT_DIR, file), 'utf-8'));
    const groupSlug = file.replace('.json', '');
    const theme = GROUP_THEMES[groupSlug] || GROUP_THEMES.default;

    // Generate group OG image
    console.log(`📁 Generating OG image for ${groupData.name}...`);
    const groupTemplate = createGroupOGTemplate(
      groupData.name,
      groupData.members.length,
      groupData.fandom,
      theme
    );
    const groupPng = await generatePNG(groupTemplate, font);
    writeFileSync(join(groupsDir, `${groupSlug}.png`), groupPng);
    totalGroups++;

    // Generate member OG images
    for (const member of groupData.members) {
      const memberSlug = member.id || member.nameEn.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
      console.log(`  └─ ${member.nameEn}...`);
      
      const memberTemplate = createMemberOGTemplate(
        member.nameEn,
        groupData.name,
        theme,
        {
          mbti: member.mbti,
          emoji: member.emoji,
        }
      );
      const memberPng = await generatePNG(memberTemplate, font);
      
      // Save in group subfolder
      const memberGroupDir = join(membersDir, groupSlug);
      if (!existsSync(memberGroupDir)) mkdirSync(memberGroupDir, { recursive: true });
      writeFileSync(join(memberGroupDir, `${memberSlug}.png`), memberPng);
      totalMembers++;
    }
  }

  console.log(`\n✅ OG image generation complete!`);
  console.log(`   📁 Groups: ${totalGroups}`);
  console.log(`   👤 Members: ${totalMembers}`);
  console.log(`   📂 Output: ${OUTPUT_DIR}`);
}

// Run
generateOGImages().catch(console.error);

