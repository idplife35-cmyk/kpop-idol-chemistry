# GSC 색인 보류 진단 — 2026-06-15

> 트리거: GSC "크롤링됨 - 현재 색인이 생성되지 않음" 109페이지
> 데이터: `Coverage-Drilldown-2026-06-15/테이블.csv`
> 최초 감지: 2025-10-10 (40개) → 2026-05-01 기점 100+로 증가
> 작성: Seth Godin (팀장) + seo, analytics 합동

---

## URL 패턴 5분류

| 패턴 | 수 | 상태 | 원인 | 액션 |
|------|----|------|------|------|
| A. `/pages/*` 구버전 | ~25 | meta refresh redirect (6/9 commit 581df33) | 과거 색인 잔존 | 자연 정리 대기 (4~12주) |
| B. `?lang=ko` 변형 | ~10 | canonical로 흡수됨 (확인됨) | 구버전 HTML 또는 외부 링크 | 자연 정리 대기 |
| C. `/legal/*.html` | 2 | redirect 처리 | 과거 색인 잔존 | 자연 정리 대기 |
| D. **멤버 페이지** | ~60 | 200 OK, canonical 정상, schema 정상 | **near-duplicate** | **콘텐츠 강화 (이번 회차 핵심)** |
| E. 블로그 | ~8 | 200 OK, 본문 5300~7900자 | 신뢰도/시간 | 자연 정리 대기, 내부 링크 강화 |

---

## 핵심 진단 — D. 멤버 페이지 60개

### 사실
- 본문 unique 영역 ~2500자, 전체 ~3000자 (네비/푸터 제외)
- schema.org `WebApplication` + `Person.memberOf MusicGroup` 정상
- canonical 정상, `?lang=ko` 변형 canonical도 정상
- 멤버 페이지 컴포넌트 한 곳에서 200여 페이지 자동 생성 → **거의 동일 UI + 데이터 치환**
- 코멘트에 이미 한 번 GSC family 제외 이력 명시 (random `aggregateRating` 위반 후 제거)

### 가설 (강 → 약)
1. **near-duplicate 시그널**: 같은 폼·FAQ·CSS·구조에 멤버 데이터(이름·MBTI·생일)만 치환 → Google이 유사 페이지 군집으로 판단, 일부만 색인.
2. **신뢰도/시간**: 사이트 도메인 권위 낮음, 백링크 부족, 멤버 페이지가 freshness 신호 약함 (lastmod만 일괄 동일).
3. **boilerplate 비율 과다**: 헤더·푸터·FAQ·홍보 박스가 본문보다 큼.

### 강 가설 기반 액션
- **멤버별 unique 콘텐츠 5종 강화** (이번 회차):
  1. 멤버별 인기 곡/대표 무대 3개 (텍스트만, 저작권 안전)
  2. 멤버별 trivia 5종 (현 `funFacts` 활용 + 확장)
  3. 멤버별 fandom 사인/응원 구호 (있을 경우)
  4. 같은 그룹 내 다른 멤버와의 차별점 1단락 ("Why Jungkook is different from Jimin")
  5. **멤버별 케미 점수 해석 가이드** (Lover/Best Friend/Soulmate 등 8개 관계 타입 각각 멤버 특성 반영 1줄씩)
- **내부 링크 강화**: 멤버 페이지 하단에 "Same group → other members" + "Other groups with similar concept" 자동 링크 2~3개.
- **schema 확장**: `Person.knowsAbout`, `Person.affiliation`, `MusicGroup.member` 양방향. 같은 그룹 멤버 간 `Person.relatedTo`.
- **OG image**: 이미 멤버별 자동 생성. 본문 hero에 같은 자산 노출 → 페이지마다 시각적 unique 시그널 1장.

### 비액션 (의도적)
- 멤버별 사진/AI 닮음 이미지: **TEAM.md 금기, 6/9 회의 결정** 그대로.
- aggregateRating 부활: 이전에 한 번 제외된 이력. 금지.

---

## 핵심 진단 — A/B/C. legacy URL 27개

- 이미 6/9 commit `581df33`에서 meta refresh + canonical 처리. 정적 호스팅(GitHub Pages)이라 진짜 301 못 보냄.
- Google이 meta refresh를 redirect로 해석하긴 하지만 **약한 시그널**이라 4~12주 걸림.
- **현재 sitemap에서 legacy 경로 0건** (`grep`으로 확인 완료) → 진입 차단 OK.
- 추가 액션: 없음. 단, 2주 후 GSC에서 감소 추세 확인.

---

## 핵심 진단 — E. 블로그 8개

- 본문 5300~7900자 → thin 아님.
- 가설: **신뢰도/시간** + **내부 링크 부족**.
- 액션:
  - 인덱스 + 그룹 페이지 푸터에 관련 블로그 글 1~2개 노출 (내부 링크 ↑)
  - 블로그 글 → 그룹/멤버 페이지로 inbound 링크 (현재 부족)
  - 블로그 글에 lastmod 갱신 (콘텐츠 일부 fresh 신호)

---

## 실행 순서

### Phase 1 (이번 회차, 즉시)
1. **멤버 페이지 unique 콘텐츠 5종 강화** (P0)
   - `src/pages/[group]-name-generator/[member]/index.astro`에 신규 섹션 추가
   - 콘텐츠 콜렉션 스키마에 `popularSongs`, `chemistryByRelation` 필드 추가 (없으면 fallback 텍스트)
   - 데이터 누락된 멤버는 자동 생성된 일반화 텍스트 (그룹·포지션·MBTI 기반)
2. **내부 링크 자동 생성** — 멤버 페이지 하단 "More members from {Group}" + "Try other groups"
3. **블로그 → 페이지 양방향 링크** — 인덱스 / 그룹 페이지 푸터에 관련 블로그 2개

### Phase 2 (1주 후, 검증)
4. GSC URL Inspection으로 멤버 페이지 5개 샘플 재요청
5. 7일 후 색인 상태 변화 측정

### Phase 3 (롤백 게이트)
- 2주 후에도 멤버 페이지 색인 < 50% → 멤버 페이지 군집 자체 재설계 (그룹 페이지에 멤버 섹션 임베드, 멤버 단독 페이지 제거 검토)

---

## 사용자 확인 필요 (결정 사항)

(없음 — 모든 액션이 회의 결정과 정합. 자율 진행.)

---

## 측정 KPI

| 지표 | 베이스라인 | 1주 후 목표 | 2주 후 목표 |
|------|-----------|-----------|------------|
| GSC "크롤링됨-색인안됨" | 109 | 90 이하 | 50 이하 |
| 색인된 페이지 | (확인 필요) | +30 | +60 |
| 멤버 페이지 색인율 | ~0% | 30% | 60% |
