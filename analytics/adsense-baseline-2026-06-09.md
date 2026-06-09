# AdSense 코드 베이스라인 — 2026-06-09

> 작성: Ad Ops (adops)
> 출처: 사이트 코드 정적 분석 (콘솔 데이터 미접근 — 사용자 액션 대기)

---

## 발견 사실

### Publisher 식별자
- `ca-pub-9514930752765161` (확인 완료, `public/ads.txt`와 `BaseLayout.astro` 정합)
- AdSense ads.txt 1줄: `google.com, pub-9514930752765161, DIRECT, f08c47fec0942fa0`

### 광고 SDK 로딩 전략 (BaseLayout.astro)
- `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` 동적 로딩
- 사용자 인터랙션 후 로딩 추정 (정확한 트리거는 BaseLayout 후반 확인 필요)

### 광고 placement 인벤토리

| 위치 | 컴포넌트 | 타입 | 슬롯 ID | 적용 페이지 |
|------|---------|------|---------|------------|
| 메인 상단 | index.astro:103 | responsive | (미설정) | / (홈) |
| 그룹 페이지 상단 | GeneratorLayout:55 | responsive | (미설정) | /[group]-name-generator/ × 14+ |
| 그룹 페이지 중간 | GeneratorLayout:61 | in-article | (미설정) | (위와 동일) |
| 그룹 페이지 하단 | GeneratorLayout:67 | responsive | (미설정) | (위와 동일) |
| 블로그 상단 | blog/index.astro:44 | (기본=responsive) | `blog-top` | /blog |
| 블로그 하단 | blog/index.astro:110 | (기본=responsive) | `blog-bottom` | /blog |
| 블로그 글 상단 | blog/[...slug].astro:94 | (기본=responsive) | `article-top` | /blog/* |
| 블로그 글 하단 | blog/[...slug].astro:101 | (기본=responsive) | `article-bottom` | /blog/* |

### 성능 최적화
- ✅ Intersection Observer 200px rootMargin lazy load — CLS·LCP 보호
- ✅ `min-height` 사전 reservation — CLS prevention
- ✅ Production 빌드에서만 렌더 (`import.meta.env.PROD`)
- ✅ Placeholder fallback (ad blocker 대응)
- ✅ 모바일 호환 (responsive 자동)

---

## 진단

### 강점
1. **CLS/LCP 보호 인프라가 단단함** — 광고 추가가 SEO 점수를 직접 해치지 않음
2. **블로그는 슬롯 ID 명명 규칙 정합** (`blog-top`, `article-bottom` 등) — AdSense 콘솔에서 슬롯별 RPM 분리 측정 가능
3. **Auto-mode/Manual 혼용 가능 구조** — 광고 형식 실험 여지 있음

### 약점 (P0)
1. ❌ **그룹/메인 페이지의 광고 슬롯 ID 미설정** — 슬롯별 단가 분석 불가. AdSense 콘솔에서 "이 슬롯의 RPM이 얼마인지" 답할 수 없는 상태.
   - **해결:** 모든 AdSlot 호출에 `slot="kpop-home-top"` 등 명시적 슬롯 ID 부여. AdSense 콘솔에서 슬롯 ID를 미리 생성해야 함 (사용자 액션 필요).
2. ❌ **메인 페이지 광고 1개만** — 트래픽 큰 페이지에서 광고 임프레션 손실. 그러나 메인은 사용자가 케미 생성 흐름으로 진입하는 곳 → 광고를 늘리면 전환 저해.
   - **해결:** 메인은 1개 유지가 적절 (Seth Godin 체크리스트 통과). 단 메인 광고를 viewport 첫 화면 너무 위에 두지 말 것.
3. ❌ **GeneratorLayout 3개 광고 배치 — 광고/콘텐츠 비율 점검 필요**
   - 결과 화면(케미 점수 + 공유 카드 + 분석)이 길어지면 3개는 적절. 짧으면 광고 밀도 과다.
   - **해결:** 실제 페이지 길이 측정 + 광고 viewport 노출률 측정 (Auto Ads 활성화 검토).

### 광고 정책 (Seth Godin 체크리스트)
- ✅ 인터스티셜·팝업 없음
- ✅ 광고 클릭 유도 카피 없음
- ✅ 광고/콘텐츠 시각적 구분 명확 ("Advertisement" 라벨)

---

## 100만원 수익 모델 시뮬레이션

### 가정
- 사용자당 평균 페이지뷰: **2.5 PV** (메인 → 그룹 페이지 → 재방문 시 결과 페이지)
- 페이지당 광고 노출(viewable): 평균 1.5개 (lazy load 고려 시 일부 미노출)
- 영어권 트래픽 비중 70% (1차 부족 결정)

### RPM 시나리오
| 시나리오 | 가정 | RPM | 필요 PV/월 (100만원 = $750) |
|---------|------|-----|------------------------------|
| 비관 | 동남아·인도 트래픽 다수, 한국·일본 일부 | $1.5 | 500,000 |
| 중립 | 영어권 50% (미·영·캐·호·필·인) | $2.5 | 300,000 |
| 낙관 | 영어권 70% + 미국 비중 30%+ | $4.0 | 187,500 |
| Premium | Mediavine/AdThrive 진입 후 | $7.0 | 107,000 |

### 현재 위치 (베이스라인)
- 7일 활성 사용자 269 → 추정 월 PV ~2,700 (사용자당 2.5 PV 가정)
- 추정 월 수익: **$4~$11**
- 100만원까지: **40배~190배 PV 격차**

---

## Week 1 ~ Week 4 Ad Ops 실행 계획

### Week 1 (즉시)
- [ ] **슬롯 ID 명명 + AdSense 콘솔에 광고 단위 생성** (사용자 액션 필요)
  - `kpop-home-mid`, `kpop-group-top`, `kpop-group-mid`, `kpop-group-bottom`
  - 콘솔에서 생성 후 환경변수 또는 상수로 코드에 주입
- [ ] **AdSense → GA4 연동 확인** (GA4 Admin → AdSense 통합)
- [ ] **광고 단가 7일 베이스라인 추출** (콘솔 또는 AdSense Management API)

### Week 2~3
- [ ] **광고 위치 A/B 1건** (예: GeneratorLayout 상단 광고 위치 — 결과 화면 위 vs 아래)
- [ ] **재방문율 영향 측정** — 광고 변경 전후 7일 재방문율 (analytics 협업)
- [ ] **Auto Ads 활성화 vs Manual 비교 실험** (Auto Ads는 별도 페이지 1개에 시범)

### Week 4 (Month 1 회고)
- [ ] **국가별 RPM 분포 보고** — 미국·영국·일본·한국·기타
- [ ] **광고 단위별 RPM 분포** — 가장 약한 단위 1개 식별 → 위치 변경 or 제거
- [ ] **Mediavine 50,000 PV/월 조건 대비 진척률** 보고

---

## 사용자 액션이 필요한 항목 (요약)

1. **AdSense 콘솔 접근** — 슬롯 ID 생성, RPM 데이터 추출 권한
   - 또는 AdSense Management API 클라이언트 셋업 (서비스 계정)
2. **GA4 ↔ AdSense 연동 활성화** (Admin → Product links → AdSense)
3. **(P1) Mediavine 가입 신청 준비** — 50,000 PV/월 도달 시 검토

---

## 변경 이력
- 2026-06-09: 코드 정적 분석 베이스라인 작성. 콘솔 데이터 미반영 (사용자 액션 대기).
