#!/usr/bin/env node
/**
 * Daily brief generator — consumes today's GA snapshot and writes a Markdown
 * briefing that the Seth Godin lead reads each morning.
 *
 * Inputs:
 *   analytics/daily/YYYY-MM-DD.json   (from ga_client.mjs)
 *   analytics/daily/YYYY-MM-DD-1.json (yesterday, for delta — optional)
 *
 * Outputs:
 *   meetings/briefings/YYYY-MM-DD.md
 *
 * Self-correction triggers (from TEAM.md):
 *   - 7-day active users on track vs M1 target (600)?
 *   - Re-visit rate trend?
 *   - Conversion events firing? (was 0 at baseline)
 *   - Country mix matches 1st tribe (English-speaking 80%)?
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

const ENGLISH_TIER1 = new Set([
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Ireland', 'New Zealand',
]);
const ENGLISH_TIER2 = new Set([
  'Philippines', 'Indonesia', 'India', 'Singapore', 'Malaysia', 'South Africa', 'Nigeria',
]);

async function readSnapshot(date) {
  try {
    const raw = await fs.readFile(path.join(__dirname, 'daily', `${date}.json`), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return (numerator / denominator) * 100;
}

function deltaPct(curr, prev) {
  if (prev === null || prev === undefined || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

function fmt(n, digits = 0) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return Number(n).toLocaleString('ko-KR', { maximumFractionDigits: digits });
}

function fmtSigned(n, digits = 1) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(digits)}`;
}

function classifyCountryMix(byCountry) {
  let t1 = 0, t2 = 0, korea = 0, japan = 0, other = 0, total = 0;
  for (const row of byCountry) {
    const users = row.activeUsers || 0;
    total += users;
    if (ENGLISH_TIER1.has(row.country)) t1 += users;
    else if (ENGLISH_TIER2.has(row.country)) t2 += users;
    else if (row.country === 'South Korea') korea += users;
    else if (row.country === 'Japan') japan += users;
    else other += users;
  }
  return { t1, t2, korea, japan, other, total };
}

function detectTriggers(today, prev) {
  const t = [];
  const h = today.headline || {};

  // M1 target: 600 active users / 7d. Flag if very far below.
  if ((h.activeUsers || 0) < 100) {
    t.push('🚨 7일 활성 사용자 100 미만 — M1 목표 600의 17%. 트래픽 가속 시급.');
  }

  const conversions = today.conversion_events?.length || 0;
  if (conversions === 0) {
    t.push('🚨 주요 이벤트(전환) 0 — Week 1 P0 1번이 미완료 상태. GA4 Admin에서 5개 이벤트를 Key Event로 마킹 필요.');
  }

  const mix = classifyCountryMix(today.by_country || []);
  const englishShare = pct(mix.t1 + mix.t2, mix.total);
  if (mix.total > 50 && englishShare < 30) {
    t.push(`⚠️ 영어권 트래픽 비중 ${englishShare.toFixed(0)}% — 1차 부족 결정(영어권 70%+ 목표) 이탈.`);
  }

  if (prev) {
    const dAU = deltaPct(h.activeUsers || 0, prev.headline?.activeUsers || 0);
    if (dAU !== null && dAU < -15) {
      t.push(`🚨 7일 활성 사용자 전일 대비 ${dAU.toFixed(1)}% — 급락. 광고 변경/배포 영향 확인 필요.`);
    }
    const prevConv = prev.conversion_events?.length || 0;
    if (prevConv > 0 && conversions < prevConv * 0.5) {
      t.push(`⚠️ 전환 이벤트 수 급감 (${prevConv} → ${conversions}). 이벤트 발화 회귀 의심.`);
    }
  }

  // Re-visit proxy: new users / active users ratio. >95% means almost no return.
  const newShare = pct(h.newUsers || 0, h.activeUsers || 0);
  if ((h.activeUsers || 0) > 100 && newShare > 92) {
    t.push(`⚠️ 신규 사용자 비중 ${newShare.toFixed(0)}% — 사실상 재방문 없음. ladder 에이전트 즉시 점검.`);
  }

  return t;
}

function findEvent(events, name) {
  return events?.find((e) => e.eventName === name);
}

async function writeBrief(snapshot, prev) {
  const h = snapshot.headline || {};
  const events = snapshot.by_event || [];
  const mix = classifyCountryMix(snapshot.by_country || []);
  const triggers = detectTriggers(snapshot, prev);

  const nameGen = findEvent(events, 'name_generated');
  const shared = findEvent(events, 'result_shared');
  const vsBattle = findEvent(events, 'vs_battle_resolved');
  const favorite = findEvent(events, 'favorite_added');

  const lines = [
    `# 부족 건강 브리핑 — ${snapshot.pulled_at?.slice(0, 10) || today}`,
    '',
    `> 작성: analytics 에이전트 (자동)`,
    `> 출처: GA4 Data API, 윈도우 ${snapshot.window}, property ${snapshot.property_id}`,
    '',
    '## 헤드라인 (지난 7일)',
    '',
    '| 지표 | 값 | 전 스냅샷 대비 |',
    '|------|----|------|',
    `| 7일 활성 사용자 | ${fmt(h.activeUsers)} | ${fmtSigned(deltaPct(h.activeUsers, prev?.headline?.activeUsers))}% |`,
    `| 신규 사용자 | ${fmt(h.newUsers)} | ${fmtSigned(deltaPct(h.newUsers, prev?.headline?.newUsers))}% |`,
    `| 페이지뷰 | ${fmt(h.screenPageViews)} | ${fmtSigned(deltaPct(h.screenPageViews, prev?.headline?.screenPageViews))}% |`,
    `| 이벤트 수 | ${fmt(h.eventCount)} | ${fmtSigned(deltaPct(h.eventCount, prev?.headline?.eventCount))}% |`,
    `| 세션 | ${fmt(h.sessions)} | ${fmtSigned(deltaPct(h.sessions, prev?.headline?.sessions))}% |`,
    `| 참여율 | ${(h.engagementRate * 100 || 0).toFixed(1)}% | — |`,
    `| 사용자당 이벤트 | ${(h.eventCount / Math.max(h.activeUsers, 1)).toFixed(2)} | — |`,
    `| 신규 비중 (재방문 역지표) | ${pct(h.newUsers, h.activeUsers).toFixed(1)}% | — |`,
    '',
    '## 1차 부족 적합도 (영어권 우선)',
    '',
    '| 세그먼트 | 활성 사용자 | 비중 |',
    '|---------|-------------|------|',
    `| 영어권 Tier 1 (US/UK/CA/AU/IE/NZ) | ${fmt(mix.t1)} | ${pct(mix.t1, mix.total).toFixed(1)}% |`,
    `| 영어권 Tier 2 (PH/ID/IN/SG/MY 등) | ${fmt(mix.t2)} | ${pct(mix.t2, mix.total).toFixed(1)}% |`,
    `| 한국 | ${fmt(mix.korea)} | ${pct(mix.korea, mix.total).toFixed(1)}% |`,
    `| 일본 | ${fmt(mix.japan)} | ${pct(mix.japan, mix.total).toFixed(1)}% |`,
    `| 기타 | ${fmt(mix.other)} | ${pct(mix.other, mix.total).toFixed(1)}% |`,
    '',
    `→ 목표: 영어권 (Tier 1+2) ≥ 70%. **현재 ${pct(mix.t1 + mix.t2, mix.total).toFixed(1)}%**`,
    '',
    '## 정체성 행동 이벤트 (P0 KPI)',
    '',
    '| 이벤트 | 발생 수 | 사용자 수 |',
    '|-------|--------|----------|',
    `| name_generated | ${fmt(nameGen?.eventCount)} | ${fmt(nameGen?.totalUsers)} |`,
    `| vs_battle_resolved | ${fmt(vsBattle?.eventCount)} | ${fmt(vsBattle?.totalUsers)} |`,
    `| result_shared | ${fmt(shared?.eventCount)} | ${fmt(shared?.totalUsers)} |`,
    `| favorite_added | ${fmt(favorite?.eventCount)} | ${fmt(favorite?.totalUsers)} |`,
    '',
    '## 100만원 경로 추적',
    '',
    `- 월 PV 추정 (지난 7일 × 4.3): ${fmt(Math.round((h.screenPageViews || 0) * 4.3))}`,
    `- 추정 월 수익 @ RPM $3: $${((h.screenPageViews || 0) * 4.3 * 3 / 1000).toFixed(2)}`,
    `- 추정 월 수익 @ RPM $5: $${((h.screenPageViews || 0) * 4.3 * 5 / 1000).toFixed(2)}`,
    `- 100만원(= $750)까지 필요 배수 @ RPM $3: **${((750 * 1000) / Math.max((h.screenPageViews || 0) * 4.3 * 3, 1)).toFixed(1)}×**`,
    '',
    '## 자기수정 트리거',
    '',
    triggers.length ? triggers.map((t) => `- ${t}`).join('\n') : '- (오늘은 트리거 없음)',
    '',
    '## 팀장 판단 요청',
    '',
    triggers.length
      ? '위 트리거 중 🚨 항목에 대해 팀장 (Seth Godin) 즉시 검토 + 다음 자기수정 액션 결정.'
      : '오늘은 자율 실행 모드. 다음 회고는 일요일.',
    '',
    '---',
    '',
    '*자동 생성됨. 원본 데이터: `analytics/daily/' + today + '.json`*',
  ];

  const outDir = path.join(ROOT, 'meetings', 'briefings');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${today}.md`);
  await fs.writeFile(outPath, lines.join('\n'));
  console.log(`[daily_brief] Wrote ${outPath}`);
  if (triggers.length) {
    console.log(`[daily_brief] ${triggers.length} self-correction trigger(s) detected.`);
    process.exitCode = 2; // distinguishable exit for cron/notification
  }
}

const snap = await readSnapshot(today);
if (!snap) {
  console.error(`[daily_brief] No snapshot for ${today}. Run ga_client.mjs first.`);
  process.exit(1);
}
const prev = await readSnapshot(yesterday);
await writeBrief(snap, prev);
