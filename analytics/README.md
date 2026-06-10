# analytics/ — 데일리 PDCA 자동화

> 매일 09:00 KST에 GA4 → 부족 건강 브리핑 → 자기수정 트리거 감지까지 한 번에 돌아가는 자동화 도구 세트.
> 사이트 빌드와 격리 (`package.json` 별도).

## 파일

| 파일 | 역할 |
|------|-----|
| `ga_client.mjs` | GA4 Data API로 7일 스냅샷 JSON 추출 (권장) |
| `ga_scraper.mjs` | Playwright로 GA 홈 스크래핑 (API 셋업 전 임시) |
| `trend_pull.mjs` | Reddit RSS + Wikipedia 컴백 + (옵션) YouTube/Twitter → 그룹 신호 점수 |
| `daily_brief.mjs` | 스냅샷 → 마크다운 브리핑 + 자기수정 트리거 |
| `run_daily.sh` | 위 3개를 순서대로 실행하는 cron 진입점 |
| `package.json` | 의존성 격리 |
| `baseline-2026-06-09.md` | 미션 시작 시점 베이스라인 |
| `adsense-baseline-2026-06-09.md` | 광고 인벤토리 + 100만원 모델 시뮬레이션 |

## 현재 운영 상태 (2026-06-10)

- **trend_pull**: 매일 09:00 KST GitHub Actions 자동 가동 ✅
- **GA Data API**: 조직 정책(`iam.disableServiceAccountKeyCreation`)으로 서비스 계정 키 발급 차단됨 → 폴백 경로 채택
- **ga_scraper (Playwright)**: 로컬 실행 옵션. 데이터 필요 시 수동 또는 launchd 자동.

## A. GA 데이터가 필요할 때 — Playwright 폴백

```bash
cd ~/project/kpop-idol-chemistry/analytics
npm install playwright
npx playwright install chromium
node ga_scraper.mjs                # 첫 실행 시 Google 로그인 1회 — 세션 저장됨
```

이후 결과는 `analytics/daily/YYYY-MM-DD-scraped.json` + 스크린샷에 저장. 로컬 머신에서 매일 자동화하려면 macOS launchd LaunchAgent로 등록.

## B. GA Data API 경로 (현재 차단, 우회 가능해지면)

조직 정책이 해제되거나 별도 GCP 프로젝트(개인 계정)를 쓸 수 있게 되면:

```bash
# 1) Google Cloud Console
#    - 프로젝트 선택 (개인 계정 권장)
#    - "Google Analytics Data API" 활성화
#    - IAM → 서비스 계정 생성 → 키 (JSON) 다운로드
#    - analytics/service-account.json 으로 저장

# 2) GA4 Admin (property G-K3G6XK3SXW, 숫자 ID 506354216)
#    - Property access management → 서비스 계정 이메일에 Viewer 권한

# 3) 환경변수
cp .env.example .env.local
# (GA4_PROPERTY_ID는 .env.example에 506354216 이미 기록되어 있음)
npm install
node ga_client.mjs
```

## 데일리 실행

```bash
cd ~/project/kpop-idol-chemistry/analytics
./run_daily.sh
```

마지막 줄에 다음 중 하나가 출력된다:
- `STATUS: OK brief=meetings/briefings/2026-06-10.md`
- `STATUS: TRIGGERS_FIRED brief=…` — 자기수정 트리거 발화. 팀장 즉시 검토.
- `STATUS: ERROR exit=…` — 셋업/네트워크 문제.

## 자동화 옵션

### 옵션 1: macOS cron (간단)

```bash
crontab -e
# 추가:
0 9 * * * cd /Users/paycis/project/kpop-idol-chemistry/analytics && ./run_daily.sh >> daily/run.log 2>&1
```

### 옵션 2: launchd LaunchAgent (Mac 권장 — sleep 후 catch-up 동작)

`~/Library/LaunchAgents/com.kpopname.daily.plist` 작성 (별도 가이드 — Month 2에 셋업).

### 옵션 3: Claude Code `/schedule` (Anthropic 원격 cron)

`/schedule` 슬래시 명령으로 데일리 에이전트 등록 — 로컬 머신이 꺼져 있어도 동작. 단 GA Data API 셋업이 원격 환경에 동일하게 필요.

### 옵션 4: GitHub Actions

`.github/workflows/daily-brief.yml` — 시크릿(서비스 계정 JSON)을 통해 원격에서 실행. 결과는 PR 또는 issue로 자동 푸시. 행궁동 패턴과 동형.

## 트러블슈팅

- `PERMISSION_DENIED` — 서비스 계정에 GA4 property 권한 부여 안 됨
- `GA4_PROPERTY_ID env var required` — `.env.local`에 숫자 ID 누락
- 스크래퍼 selector 실패 — GA UI 변경. `daily/YYYY-MM-DD-ga-home.png` 직접 확인 후 selector 갱신 or API 경로로 전환
