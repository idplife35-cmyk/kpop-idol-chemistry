# analytics/ — 데일리 PDCA 자동화

> 매일 09:00 KST에 GA4 → 부족 건강 브리핑 → 자기수정 트리거 감지까지 한 번에 돌아가는 자동화 도구 세트.
> 사이트 빌드와 격리 (`package.json` 별도).

## 파일

| 파일 | 역할 |
|------|-----|
| `ga_client.mjs` | GA4 Data API로 7일 스냅샷 JSON 추출 (권장) |
| `ga_scraper.mjs` | Playwright로 GA 홈 스크래핑 (API 셋업 전 임시) |
| `daily_brief.mjs` | 스냅샷 → 마크다운 브리핑 + 자기수정 트리거 |
| `run_daily.sh` | 위 3개를 순서대로 실행하는 cron 진입점 |
| `package.json` | 의존성 격리 |
| `baseline-2026-06-09.md` | 미션 시작 시점 베이스라인 |
| `adsense-baseline-2026-06-09.md` | 광고 인벤토리 + 100만원 모델 시뮬레이션 |

## 1회성 셋업

### A. GA Data API 경로 (권장, 무료)

```bash
# 1) Google Cloud Console
#    - 프로젝트 생성/선택
#    - "Google Analytics Data API" 활성화
#    - IAM → 서비스 계정 → "GA4 Reader" 생성 → 키 (JSON) 다운로드
#    - 다운로드한 파일을 analytics/service-account.json 으로 저장

# 2) GA4 Admin (property G-K3G6XK3SXW)
#    - Property access management → 위 서비스 계정 이메일 추가, 역할: Viewer
#    - Property Settings → "Property ID" 숫자값 복사 (G-XXXX 아님)

# 3) 로컬 셋업
cd ~/project/kpop-idol-chemistry/analytics
cp .env.local.example .env.local   # 없으면 직접 작성
echo 'GA4_PROPERTY_ID=숫자아이디' >> .env.local
npm install
node ga_client.mjs                 # daily/YYYY-MM-DD.json 생성 확인
```

### B. Playwright 폴백 경로 (즉시 가능)

```bash
cd ~/project/kpop-idol-chemistry/analytics
npm install playwright
npx playwright install chromium
node ga_scraper.mjs                # 첫 실행 시 Google 로그인 1회 — 세션 저장됨
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
