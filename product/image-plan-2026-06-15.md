# 이미지 자산 계획 — 2026-06-15

> 작성: Seth Godin (팀장)
> 트리거: 사용자 지시 "유저들이 머무르게 하기 위한 페이지별 이미지(아이돌 캐릭터, 로고) 추가"
> 선행: `meetings/2026-06-09-image-strategy.md` (Phase 1 결정)

---

## 정렬

사용자 요청 "아이돌 캐릭터·로고"를 6/9 회의 결정과 정합:

- ❌ 실제 아이돌 사진·AI 닮음 → `meetings/2026-06-09-image-strategy.md` TEAM 금기 그대로 유지.
- ✅ "아이돌 캐릭터" = **팬진(zine) 톤 컨셉 일러스트**. 인물 묘사 없이 그룹 미학(컬러·이모지·세계관)으로 표현. 한 장에 멤버 다수 추상 표현 포함 가능.
- ✅ "로고" = 그룹명 텍스트 로고 일러스트(현존 브랜드 로고 모방 X, 우리 사이트의 자체 텍스트 아트).

→ 결과: Phase 1 (그룹 hero 24장) + 모든 그룹에 hero 자산 단일화. 멤버 단독 이미지는 Phase 2로 그대로 유보.

---

## 페이지별 이미지 슬롯 매트릭스

| 페이지 | 슬롯 | 현재 | 계획 | 자산 재사용 |
|--------|------|------|------|-----------|
| `/` 히어로 | 메인 배경 | 텍스트만 | (P2) 부족 만신전 모자이크 | 24장 hero 합성 |
| `/` 그룹 스토리 동그라미 | 그룹별 썸 | 첫 글자 ❌ | **hero crop 원형 마스크** | 24장 hero 재사용 |
| `/{group}-name-generator/` GroupBanner 로고박스 | 80×80 로고 | 8/24 (404 의심) | **텍스트 로고 SVG → JSON `logo` 갱신** | logo 24장 |
| `/{group}-name-generator/` GroupBanner 배경 | 1200×630 | 그룹 컬러 그라데이션만 | **hero 일러스트 배경** | hero 24장 |
| `/{group}-name-generator/` MemberGrid 카드 | 56×56 | 100% 이모지 | **회의 결정 유지: SVG 추상 아바타** (LCP zero) | 코드 생성 |
| `/{group}-name-generator/{member}/` 단독 | 미정 | 없음 | **Phase 2 보류** (7일 데이터 후) | - |
| `/blog/...` 썸네일 | 미정 | - | 현 요청 범위 외 | - |
| `/about`,`/contact`,`/privacy`,`/terms` | - | 텍스트 | 현 요청 범위 외 | - |

---

## 자산 인벤토리 (생성 대상)

### A. 그룹 hero 일러스트 (24개) — 1200×630 WebP, 목표 < 80KB

세스고딘 부족 적합도(`tribe/worldview-v1.md`) 우선순위로 큐 순서 결정. ChatGPT 거부/품질 부족 시 즉시 P0 그룹부터 재시도.

**P0 — 부족 핵심 8그룹** (4·5세대 메가 + 절대 트래픽 BTS)
1. BTS / ARMY / `#7B2B8F` 💜
2. NewJeans / Bunnies / `#5B9BD5` 👖
3. IVE / DIVE / `#FFB6C1` 💗
4. BLACKPINK / BLINK / `#FF007F` 🖤
5. ZEROBASEONE / ZEROSE / `#1F75FE` 💎
6. aespa / MY / `#9966FF` 🌐
7. LE SSERAFIM / FEARNOT / `#000000` 🔥
8. KATSEYE / EYEKONS / `#FF4F8B` 🌟

**P1 — 안정 트래픽 8그룹**
9. Stray Kids `#FF3333` 🖤
10. TWICE `#FF5FA2` 🍭
11. SEVENTEEN `#F8C8DC` 💎
12. RIIZE `#FF8C00` 🌟
13. PLAVE `#6B5B95` 🎭
14. ITZY `#FF3366` ✨
15. ENHYPEN `#FF6B35` 🦇
16. TXT `#0ABAB5` 🦋

**P2 — 롱테일 8그룹**
17. EXO `#C0C0C0` 👑
18. ATEEZ `#0066CC` ⚓
19. NCT 127 `#00FF00` 🌿
20. Red Velvet `#FF0000` 🍰
21. (G)I-DLE `#9B59B6` 🔮
22. ILLIT `#FFD8E4` 🌷
23. HUNTR/X `#2C3E50` 🎯 (가공 그룹, K-Pop Demon Hunters)
24. Saja Boys `#E74C3C` 🦁 (가공 그룹)

**저장 경로**: `public/images/groups/{slug}-hero.webp`
(빌드 후 `<Image>` 컴포넌트로 80KB 검증)

### B. 그룹 텍스트 로고 (24개) — 240×120 SVG/PNG, 투명 배경

기존 8개(`images/` 산재)는 빌드 시 public으로 복사 안 됨 → 전체 24개를 `public/images/groups/{slug}-logo.png`로 통일 + JSON `logo` 필드 일괄 갱신.

ChatGPT 프롬프트: "graphic typography of the text '{GROUP_NAME}', custom lettering, monoline, transparent background, {color} accent". 현존 브랜드 로고 모방 금지.

### C. 멤버 추상 아바타 (164명) — 코드 생성, 이미지 파일 X

`MemberAvatar.astro` 컴포넌트로 SVG 즉시 렌더 (회의 결정 유지). 패턴:
- 그룹 컬러 그라데이션 원형 배경
- 멤버 이니셜(흰색, 큰 글자)
- 우측 하단 멤버 이모지 (이미 JSON에 존재)
- LCP 영향 zero

### D. 부족 만신전 모자이크 (1장, P2) — 인덱스 히어로 배경

24장 hero를 모자이크로 합성한 1장. P0/P1 완료 후 마지막에 자동 합성. 부족 정체성 강화.

---

## ChatGPT 자동화 (도구)

`tools/chatgpt-image-bot.mjs`:
1. Playwright headless=false로 `chatgpt.com` 오픈
2. **사용자 수동 로그인 대기** (검증: 입력창 selector 노출)
3. 큐 파일 `tools/image_queue.json` 읽어 프롬프트 순차 입력
4. 이미지 생성 완료 감지 → 다운로드 → 지정 경로 저장
5. 실패한 항목은 `tools/image_queue_failed.json`에 분리

큐는 본 계획에서 hero 24개 + logo 24개 = **총 48개 자동 처리**.

---

## 적용 (코드 패치)

1. **컨텐츠 콜렉션** — `src/content/groups/*.json`의 `logo`를 `/images/groups/{slug}-logo.png`로 일괄 갱신. hero용 신규 필드 `heroImage: "/images/groups/{slug}-hero.webp"` 추가.
2. **콜렉션 스키마** — `src/content/config.ts`에 `heroImage: z.string().optional()` 추가.
3. **GroupBanner.astro** — hero를 배경 `<img>`로 절대 배치 + 그라데이션 오버레이 유지. 로고박스는 새 logo 사용.
4. **MemberAvatar.astro** — 신규 SVG 컴포넌트.
5. **MemberGrid.astro** — `MemberAvatar` 사용으로 교체.
6. **인덱스 group-story** — 첫글자 fallback을 hero crop 원형으로 교체 (그룹 컬러 ring 유지).

---

## 검증 (Phase 1 종료 게이트)

- ✅ 빌드 후 `dist/images/groups/` 24×2 = 48 파일 존재
- ✅ Lighthouse LCP < 2.5s (그룹 페이지)
- ✅ 신규 이미지 평균 < 80KB
- ✅ 404 0건
- ✅ TEAM.md 금기(실인물·AI 닮음) 위반 0건

기준 미달 시 즉시 롤백 (PR 분리, 자산 디렉토리 보존).

---

## Phase 2 트리거 (7일 후)

- 재방문율 +2pp 이상 → 멤버 단독 일러스트 1~2 그룹 시범
- 변화 없음 → hero 디자인 톤 재검토 (analytics A/B)
- 재방문율 하락 → 롤백 + tribe-intel 진단
