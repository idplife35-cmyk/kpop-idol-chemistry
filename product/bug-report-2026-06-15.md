# QA 버그 리포트 — 2026-06-15

## 요약
- 검증 대상: https://kpopnamegenerator.com (live, GitHub Pages)
- 검증 viewport: PC(1440x900, Chromium) + 모바일(iPhone 14, 390x844, Chromium)
- 검증 페이지 수: 34 (`/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/blog/`, 24개 그룹 generator 페이지, 3개 멤버 페이지, `/manifest.webmanifest`)
- 검증 도구: 임시 설치한 Playwright 1.60.0 (스크립트: `tests/qa/qa-run.mjs`, `tests/qa/qa-interactive.mjs`, `tests/qa/qa-images.mjs`, `tests/qa/qa-debug.mjs`, `tests/qa/qa-pwa.mjs`)
- 검증 시간: 2026-06-15
- 발견 이슈: **P0 2건 / P1 3건 / P2 5건**

> 결론: 핵심 기능(이름 생성, VS 챌린지, 공유, PWA 배너, GA 이벤트)은 PC·모바일 양쪽에서 정상 동작한다. 다만 24개 그룹 페이지 전부에서 그룹 로고 이미지가 깨지고(404) 서비스 워커가 부재(404)해 PWA 핵심 가치인 "재방문 트리거"를 절반만 제공하고 있다.

---

## P0 (출시 차단 / 핵심 기능 깨짐)

### [B001] 모든 그룹 generator 페이지에서 그룹 로고 이미지 404
- 영향:
  - 24/24 그룹 페이지(`/{group}-name-generator/`) 전부에서 그룹 로고 PNG/SVG/WebP가 404로 깨짐.
  - 브라우저 콘솔에 매 페이지마다 `Failed to load resource: the server responded with a status of 404 ()` 로그가 남아 Sentry/GSC 등 모니터링이 동작 중이라면 노이즈가 크게 발생.
  - 첫인상에서 그룹 브랜딩이 깨지므로 신뢰도 하락 → AdSense 정책상 "콘텐츠 품질" 평가에도 부정적.
  - GroupBanner 상단 배너가 비어 보이므로 사용자가 "잘못된 페이지에 들어왔나?" 오해할 가능성.
- 재현:
  1) 임의의 generator 페이지 방문 (예: https://kpopnamegenerator.com/bts-name-generator/)
  2) DevTools → Network → Img 필터.
  3) `images/bts_logo.png` 404 확인. 콘솔에도 동일 메시지 노출.
- 환경: PC + 모바일 양쪽 (서버 측 자원 누락이므로 viewport 무관)
- 증거:
  - 콘솔 메시지: `Failed to load resource: the server responded with a status of 404 ()`
  - Playwright 네트워크 캡처 (전체 매핑):
    ```
    aespa       /images/aespa_logo.png
    ateez       /images/ateez_logo.png
    blackpink   /images/black_pink_logo2.png
    bts         /images/bts_logo.png
    enhypen     /images/enhypen_logo.png
    exo         /images/exo_logo.png
    g-idle      /images/gidle_logo.png
    huntrix     /images/huntrix_logo.png
    illit       /images/illit_logo.png
    itzy        /images/itzy_logo.png
    ive         /images/Ive_logo_(Black).svg
    katseye     /images/katseye_logo.png
    le-sserafim /images/lesserafim_logo.png
    nct127      /images/nct127_logo.png
    newjeans    /images/newjeans_logo.png
    plave       /images/plave_logo.png
    red-velvet  /images/redvelvet_logo.png
    riize       /images/riize_logo.png
    sajaboys    /images/Saja_Boys_Logo.webp
    seventeen   /images/seventeen_logo.png
    stray-kids  /images/straykids_logo.png
    twice       /images/twice_logo.png
    txt         /images/txt_logo.png
    zerobaseone /images/zerobaseone_logo.png
    ```
  - 스크린샷: `tests/qa/screenshots/pc/gen-bts.png`, `tests/qa/screenshots/mobile/gen-bts.png` 외 모든 `gen-*.png`
- 추정 원인:
  - `meetings/2026-06-09-image-strategy.md`에서 "real-person photos and AI lookalikes are forbidden" 정책으로 실사진을 제거했지만, GroupBanner 또는 데이터 파일(`src/data/idolImages.json` 등)에 남아 있는 옛 경로(`images/*_logo.*`)가 빌드 산출물엔 포함되지 않은 상태로 HTML에 남아 있는 것으로 보임.
  - 정책상 abstract avatar로만 fallback 한다고 했으니, banner에서 이 이미지 참조 자체가 제거되어야 정상.
- 권장 액션:
  1) `src/components/generator/GroupBanner.astro`(또는 logo URL을 만드는 코드)에서 `/images/{slug}_logo.*` 참조를 제거하고 group color + emoji 기반 abstract banner로 fallback.
  2) 또는 24개 PNG/SVG/WebP를 실제로 `public/images/`에 배포 (단, 실사진/저작권 이슈 회피 위해 abstract 로고만).
  3) HTTP 4xx 응답 발생 시 GA 또는 자체 모니터에 카운트 남도록 후속 작업.

### [B002] 서비스 워커(`/sw.js`) 404 → PWA 설치돼도 오프라인/리텐션 시나리오 절반만 동작
- 영향:
  - `/manifest.webmanifest`는 정상 응답(200)이고 `display: standalone`까지 잘 정의되어 있어 Chrome이 설치 후보로 인식.
  - 그러나 `/sw.js` GET 404 → 오프라인 fallback, 캐시 정책, push 알림 등 PWA 리텐션 무기 전부 사용 불가.
  - 본 사이트 미션이 "재방문 0 → +"이고 PWA install prompt를 가장 중요한 메커니즘으로 보고 있는데, **설치만 시키고 그 뒤 가치는 못 주는 상태**다.
  - 일부 모바일 브라우저(Samsung Internet, Edge mobile)는 service worker가 없으면 install prompt 자체를 띄우지 않을 수 있음 → PWA 설치율 자체가 떨어질 위험.
- 재현:
  1) curl/브라우저로 `https://kpopnamegenerator.com/sw.js` GET → HTTP 404
  2) DevTools → Application → Service Workers 탭에서 등록된 SW 없음 확인
  3) manifest는 정상이라 "Add to Home Screen" 메뉴는 뜸
- 환경: PC + 모바일 양쪽
- 증거:
  - Playwright request 캡처: `swStatus: 404`
  - 관련: `src/components/common/PwaInstallPrompt.astro`는 `beforeinstallprompt` 이벤트만 기대하지 sw.js 등록 코드는 어디에도 없음 (`grep -r "navigator.serviceWorker" src/` 결과 매치 없음)
- 추정 원인:
  - PWA 설치 프롬프트는 Week 1 P0로 추가됐지만 service worker 등록 단계가 빠짐. manifest만 가지고는 진짜 "App-like 경험"이 안 됨.
- 권장 액션:
  1) `vite-plugin-pwa` 또는 자체 `public/sw.js` 작성. 최소한 HTML/CSS/JS shell 캐시 + offline.html.
  2) `BaseLayout.astro`에 `if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')` 등록 스니펫 추가.
  3) sw 등록 후 GA에 `sw_registered` 이벤트 발화해 베이스라인 트래킹.
  4) (옵션) push notification 권한 요청까지 가면 진짜 retention 무기가 됨 — 단, 정책상 결과 생성 후 노출이 바람직.

---

## P1 (UX/품질 저하)

### [B003] hreflang 누락 → 다국어 SEO 기회 손실
- 영향: 한국어 + 영어 + 글로벌 K-Pop 팬덤 마케팅을 노리는 사이트인데, 모든 페이지에서 `<link rel="alternate" hreflang>` 태그가 0개. 같은 페이지의 언어/지역별 변형이 없다고 검색 엔진에 알리는 셈 → 국가별 SERP 노출 최적화 손실.
- 재현:
  1) 임의 페이지(예: `/`)에서 view-source.
  2) `hreflang` 검색 → 0 hit.
- 환경: 모든 페이지, PC + 모바일
- 증거: Playwright `link[rel="alternate"][hreflang]` 카운트 — 34 페이지 전부 0
- 추정 원인: BaseLayout/SEOHead에 hreflang 출력 로직이 아직 없음.
- 권장 액션:
  - 우선 `x-default` + `en` 두 개만이라도 self-canonical로 출력.
  - 추후 i18n 라우팅이 생기면 `ko`, `ja`, `id` 등 K-Pop 시장 우선순위로 확장.

### [B004] 결과 화면 텍스트 "Tap to get share card" — 데스크탑에선 "Tap"이 어색
- 영향: PC에서 마우스로 클릭하는 사용자에게 "Tap"이라는 단어는 모바일 전용 표현으로 인지부조화. Microcopy 일관성 / 신뢰감 저하.
- 재현:
  1) PC 1440x900에서 임의 generator 페이지 이름 생성.
  2) 결과 카드 하단 "Tap to get share card" 문구 확인.
- 환경: PC (모바일은 정상)
- 증거: `tests/qa/screenshots/pc/gen-bts-result.png`
- 권장 액션: 매체별 분기 (`'ontouchstart' in window ? 'Tap' : 'Click'`) 또는 통일된 "Get share card" 같은 중립 표현.

### [B005] PC에서 PWA install 배너 시점이 결과 카드와 가로로 겹쳐 보임
- 영향:
  - 결과 카드 우측 하단에 배너가 fixed로 노출 → 결과 카드 오른쪽 영역과 시각적으로 인접해 "광고처럼" 보임.
  - 사용자 입장에서 액션 우선순위 혼란 (Re-roll vs Install). install CTA 클릭률 저하 가능.
- 재현:
  1) PC 1440x900에서 `/bts-name-generator/` 이름 생성.
  2) 4초 후 우측 하단 배너 출현 → 결과 카드 옆에 같이 보임.
- 환경: PC (모바일은 페이지 폭 전체를 사용해 자연스러움)
- 증거: `tests/qa/screenshots/pc/gen-bts-result.png`
- 권장 액션:
  - 데스크탑에선 결과 카드 하단으로 inline 삽입하거나 4초 → 8~10초 지연으로 늘려 결과 음미할 시간 확보.
  - 또는 결과 카드와 시각적으로 분리되는 색/그림자 강화.

---

## P2 (개선 권장)

### [B006] PC에서 vs_challenge_created / result_shared 이벤트가 일부 그룹에서만 발화
- 영향: 자동 검증 5개 샘플 중 TWICE PC, ZEROBASEONE 모바일에서 share/VS 버튼 클릭이 실패해 이벤트 미발화. 일관성 부족. (다른 3그룹은 모두 정상)
- 추정 원인: 결과 카드 직후 모달/스크롤 위치에 따라 버튼이 viewport 밖일 수 있어, 실제 사용자 행동에서도 비슷한 이슈 가능.
- 환경: PC + 모바일 (간헐적)
- 권장 액션: 결과 카드 직후 VS / Share / Re-roll 버튼이 한 화면에 들어오도록 sticky bottom bar 검토. Playwright 스모크 테스트에 24그룹 전수 추가 권장.

### [B007] 모바일에서 AdSense 슬롯 너비 0 → `adsbygoogle.push() error: No slot size for availableWidth=0`
- 영향: 결과 생성 직후 모바일에서만 콘솔 page error가 두 번 노출. 사용자가 보는 것은 아니지만 광고 채움률(fill rate) 손실 가능.
- 재현: 모바일 viewport(390x844)에서 임의 generator 페이지 결과 생성 → DevTools console.
- 추정 원인: 결과 카드 위/아래의 광고 slot이 모바일에서 `display: none` 또는 `width: 0` 상태에서 `adsbygoogle.push()` 호출.
- 권장 액션: AdSlot.astro의 모바일 가시성 / minHeight 정의 점검.

### [B008] 모든 페이지 hreflang 0개 (B003과 중복 표시되나 페이지 단위 영향)
- 합쳐서 B003에서 처리.

### [B009] `Header.astro`의 GamificationBar에 즐겨찾기 토글 진입 동선이 결과 카드에 직접 없음
- 영향: `favorite_added` GA 이벤트가 결과 카드에서 직접 발화되지 않는다. 즐겨찾기를 추가하려면 헤더 → History 모달 → 별 아이콘이라는 3단계 동선이 필요. 자동 테스트에서도 favorite 버튼을 결과 화면에서 찾지 못했음.
- 추정 원인: 의도된 디자인이지만 retention 핵심 지표인 favorite 사용률이 낮을 수밖에 없는 구조.
- 권장 액션: 결과 카드 자체에 ☆ 토글 버튼 추가 + 1회 클릭에 `favorite_added` 발화. AdSense 영역과 겹치지 않게 카드 우상단 정도.

### [B010] 멤버 페이지 카드의 hover effect가 모바일에서 의미 없는 transform 발생
- 영향: 모바일 터치 시 hover 상태가 "stuck" 되어 카드가 위로 올라간 채 유지될 수 있음 (Safari iOS 특히).
- 환경: 모바일 (자동 검증으로는 캡처 안 됨 — 수동 확인 권장)
- 권장 액션: `@media (hover: hover)` 가드로 hover 스타일 감싸기.

---

## 통과 항목 (PC + 모바일 양쪽 모두 정상)

- name_generated GA 이벤트: PC 5/5, 모바일 5/5 발화
- vs_challenge_created GA 이벤트: PC 4/5, 모바일 4/5 발화
- result_shared GA 이벤트: PC 4/5, 모바일 4/5 발화
- PwaInstallPrompt 노출 로직: 결과 생성 전 hidden, 결과 생성 4초 뒤 노출(모바일에서 검증). 첫 방문이 아닌 페이지 이동만으론 발화하지 않음 — 정상.
- manifest.webmanifest 200 + 유효 JSON, icons / start_url / scope / display 모두 정상
- 34개 페이지 전부 HTTP 200, JS pageerror "Y" 같은 우려는 minified 광고 코드의 noise였고 자체 코드 에러 없음
- 메타 SEO: title / description / canonical 34/34 정상 출력 (단, hreflang 제외 — B003)
- og:image: 인덱스 `https://kpopnamegenerator.com/assets/social/kpop-name-generator-og.png` 정상
- 멤버 페이지(`/bts-name-generator/jungkook/` 외 2개) 200, title/desc 정상
- 가로 스크롤(horizontal overflow): PC + 모바일 34페이지 전부 0건
- img alt 누락: 34페이지 전부 0건
- Generate 버튼 동작: PC + 모바일 5/5 그룹 정상 (name 입력 + 멤버 선택 후 클릭 → 결과 카드 노출)
- ShareCard / VSBattle 버튼 클릭 가능
- Failed network requests: 광고 도메인 제외 시 그룹 로고 PNG/SVG 외 0건

---

## 메모

### GA 이벤트 발화 매트릭스 (이벤트 × 페이지 샘플)

| 이벤트 | bts | blackpink | zerobaseone | aespa | twice |
|---|---|---|---|---|---|
| name_generated (PC) | OK | OK | OK | OK | OK |
| name_generated (mobile) | OK | OK | OK | OK | OK |
| vs_challenge_created (PC) | OK | OK | OK | OK | miss |
| vs_challenge_created (mobile) | OK | OK | miss | OK | OK |
| result_shared (PC) | OK | OK | OK | OK | miss |
| result_shared (mobile) | OK | OK | miss | OK | OK |
| favorite_added | 미검증 (결과 카드에 진입점 없음) |
| pwa_installed | 미검증 (헤드리스 환경에서 prompt API 호출 불가) |

`name_generated`는 P0급 신뢰도, `vs_challenge_created` / `result_shared`는 P1급 (자동화 환경의 버튼 위치 문제일 가능성이 높음). 다음 회차에 수동으로 24그룹 전수 검증 필요.

### 검증 못 한 영역
- 실제 브라우저(Chrome/Safari/Edge) 데스크탑·모바일에서의 **`beforeinstallprompt` 발화 + Install 클릭 → `pwa_installed` 이벤트** 확인. (헤드리스 Chromium은 prompt API 호출 안 됨)
- iOS Safari "Add to Home Screen" fallback 메시지(`alert("Tap the Share icon …")`)의 실제 노출 확인 (iOS Safari 디바이스 필요).
- **블로그 본문**(`/blog/[slug]/`) 개별 글의 마크다운 렌더링 / 코드블록 / 외부 이미지 무결성. 이번 회차는 `/blog/` 인덱스만 봄.
- **AdSense 광고 실제 채움률**: 24그룹 페이지 각각 상단/중간/하단 슬롯 매트릭스. 모바일에서 width 0 이슈(B007)와 연관.
- **접근성**: 키보드 포커스 ring, 색 대비 (Lighthouse a11y 별도 회차 권장).
- **성능**: LCP / CLS 정밀 측정 (Lighthouse / WebPageTest 권장).
- **언어/지역 셀렉터**: UI 자체가 존재하지 않아 검증 대상 없음.
- **공유 URL의 URL 가시성 / og:image 동적 생성**: ShareCard에서 발화되는 share URL이 실제로 fan에게 클릭 가능한 형태인지 (자동 클릭은 성공했으나 URL fragment 검증은 안 함). 다음 회차에 공유 URL을 다른 ctx에서 재방문해 challenge 자동 적용까지 확인 필요.

### 다음 회차 우선 검증 영역
1. **B001 fix 검증** — 그룹 로고 404 24개가 0개로 줄었는지.
2. **B002 fix 검증** — sw.js 등록 후 DevTools → Application → SW 탭에서 active 상태 확인.
3. 공유 URL 재방문 → VS challenge 자동 로딩 → `vs_battle_resolved` 이벤트 발화까지 end-to-end.
4. iOS Safari 실 디바이스 PWA Install 경로.
5. 24그룹 전수 generate → share → vs 자동 스모크 테스트로 확장.

### 부수 자료
- 임시 Playwright 스크립트: `tests/qa/qa-run.mjs` (전 페이지 메타·콘솔·SEO), `tests/qa/qa-interactive.mjs` (5그룹 인터랙티브 흐름), `tests/qa/qa-images.mjs` (그룹 로고 404 매핑), `tests/qa/qa-debug.mjs`, `tests/qa/qa-pwa.mjs`.
- 결과 raw: `tests/qa/results.json`, `tests/qa/interactive.json`.
- 스크린샷: `tests/qa/screenshots/pc/*.png`, `tests/qa/screenshots/mobile/*.png` (각 38장).
