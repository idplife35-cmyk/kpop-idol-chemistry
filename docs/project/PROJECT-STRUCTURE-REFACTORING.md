# 📁 프로젝트 구조 리팩토링 계획

**작성일**: 2025년 11월 5일  
**목적**: 프로젝트 구조 정리 및 유지보수성 향상

---

## 🔍 현재 구조 문제점 분석

### ⚠️ **문제점 1: 루트 디렉토리 혼잡**
```
루트에 13개의 .md 문서 파일 존재:
- BTS-PAGE-IMPROVEMENT-SUMMARY.md
- CONTENT-IMPROVEMENT-PLAN.md
- HUNTRIX-SAJABOYS-SUMMARY.md
- KITSCH-STYLE-CHECKLIST.md
- PHASE1-COMPLETION-SUMMARY.md
- README.md
- REINDEX-GUIDE.md
- SEO-CHECKLIST.md
- SERVICE-ANALYSIS.md
- USER-ENGAGEMENT-STRATEGY.md
- ZERO-CLICK-OPTIMIZATION-PLAN.md
```
**영향**: 프로젝트 구조가 복잡해 보이고 핵심 파일 찾기 어려움

---

### ⚠️ **문제점 2: 중복 파일**
```
ads.txt가 2곳에 존재:
- /ads.txt (루트)
- /public/ads.txt

→ 배포 시 어느 것이 사용되는지 불명확
```

---

### ⚠️ **문제점 3: 정적 파일 분산**
```
정적 파일들이 여러 곳에 흩어져 있음:
- /assets/social/        (소셜 이미지)
- /images/               (그룹 로고)
- /public/               (robots.txt, sitemap.xml 등)

→ 일관성 없는 구조
```

---

### ⚠️ **문제점 4: 컴포넌트 위치 불명확**
```
/components/
├─ footer.html
├─ head.html
└─ header.html

→ HTML 조각만 있고, 이를 사용하는 JS는 별도 위치
→ 컴포넌트 개념이 불완전
```

---

### ⚠️ **문제점 5: 페이지 구조 비효율**
```
/pages/ 아래 44개 디렉토리, 각각 index.html만 존재
→ 각 페이지가 독립적이나 공통 로직/스타일 재사용 어려움
→ 관리 포인트가 44개
```

---

## 🎯 제안하는 새로운 구조

### **Option A: 문서 중심 정리** (추천 ⭐)

```
kpop-idol-chemistry/
│
├─ 📄 README.md                    # 프로젝트 메인 문서
├─ 📄 package.json
├─ 📄 CNAME
│
├─ 📁 docs/                        # ✨ 모든 문서 통합
│  ├─ README.md                    # 문서 인덱스
│  ├─ project/                     # 프로젝트 관리 문서
│  │  ├─ SERVICE-ANALYSIS.md
│  │  └─ PROJECT-STRUCTURE-REFACTORING.md
│  ├─ strategy/                    # 전략 문서
│  │  ├─ USER-ENGAGEMENT-STRATEGY.md
│  │  ├─ CONTENT-IMPROVEMENT-PLAN.md
│  │  └─ ZERO-CLICK-OPTIMIZATION-PLAN.md
│  ├─ seo/                         # SEO 관련
│  │  ├─ SEO-CHECKLIST.md
│  │  └─ REINDEX-GUIDE.md
│  ├─ pages/                       # 페이지별 문서
│  │  ├─ BTS-PAGE-IMPROVEMENT-SUMMARY.md
│  │  └─ HUNTRIX-SAJABOYS-SUMMARY.md
│  ├─ phase/                       # Phase별 문서
│  │  └─ PHASE1-COMPLETION-SUMMARY.md
│  └─ style/                       # 스타일 가이드
│     └─ KITSCH-STYLE-CHECKLIST.md
│
├─ 📁 public/                      # ✨ 모든 정적 파일 통합
│  ├─ favicon.ico
│  ├─ logo.svg
│  ├─ robots.txt
│  ├─ sitemap.xml
│  ├─ ads.txt                      # 중복 제거 (루트의 ads.txt 삭제)
│  │
│  ├─ assets/                      # 이미지 통합
│  │  ├─ social/                   # 소셜 미디어용
│  │  │  ├─ og-image.svg
│  │  │  ├─ twitter-card.svg
│  │  │  └─ instagram.svg
│  │  └─ logos/                    # 그룹 로고 (기존 /images/ 통합)
│  │     ├─ bts-logo.png
│  │     ├─ blackpink-logo.png
│  │     ├─ seventeen-logo.png
│  │     ├─ straykids-logo.png
│  │     ├─ newjeans-logo.png
│  │     ├─ ive-logo.svg
│  │     ├─ huntrix-logo.png
│  │     └─ sajaboys-logo.webp
│  │
│  └─ tools/                       # 개발 도구
│     └─ generate-social-images.html
│
├─ 📁 src/                         # ✨ 소스 코드 통합
│  ├─ index.html                   # 메인 페이지만 루트
│  │
│  ├─ components/                  # 공통 컴포넌트
│  │  ├─ header.html
│  │  ├─ footer.html
│  │  └─ head.html
│  │
│  ├─ pages/                       # 서브 페이지들
│  │  ├─ groups/                   # 그룹별 (24개)
│  │  │  ├─ bts/
│  │  │  │  ├─ index.html
│  │  │  │  ├─ stage.html
│  │  │  │  └─ aesthetic.html
│  │  │  ├─ blackpink/
│  │  │  ├─ seventeen/
│  │  │  ├─ stray-kids/
│  │  │  ├─ newjeans/
│  │  │  ├─ ive/
│  │  │  ├─ huntrix/
│  │  │  └─ sajaboys/
│  │  │
│  │  ├─ features/                 # 기능별 (11개)
│  │  │  ├─ kpop-name/
│  │  │  ├─ korean-name/
│  │  │  ├─ stage-name/
│  │  │  ├─ aesthetic/
│  │  │  ├─ cute/
│  │  │  ├─ badass/
│  │  │  ├─ username/
│  │  │  ├─ nickname/
│  │  │  ├─ ship-name/
│  │  │  ├─ bio-hashtag/
│  │  │  └─ couple-combiner/
│  │  │
│  │  ├─ info/                     # 정보 페이지
│  │  │  ├─ about/
│  │  │  └─ contact/
│  │  │
│  │  └─ legal/                    # 법적 문서
│  │     ├─ privacy.html
│  │     └─ terms.html
│  │
│  ├─ css/
│  │  ├─ style.css                 # 메인 스타일
│  │  ├─ components/               # 컴포넌트별 스타일
│  │  └─ themes/                   # 테마별 스타일
│  │
│  ├─ js/
│  │  ├─ app.js                    # 메인 진입점
│  │  │
│  │  ├─ core/                     # ✨ 핵심 로직 재구성
│  │  │  ├─ generator.js           # 통합된 생성 엔진
│  │  │  ├─ analytics.js           # GA4 추적
│  │  │  └─ storage.js             # LocalStorage 관리
│  │  │
│  │  ├─ features/                 # ✨ Phase 1 기능들
│  │  │  ├─ quick-generate.js      # 원클릭 생성
│  │  │  ├─ vs-mode.js             # VS 대결
│  │  │  ├─ history.js             # 히스토리
│  │  │  └─ favorites.js           # 즐겨찾기
│  │  │
│  │  ├─ generator/                # 기존 생성 로직
│  │  │  ├─ engine.js
│  │  │  ├─ romanize.js
│  │  │  ├─ seed.js
│  │  │  ├─ style-presets.js
│  │  │  └─ syllable-pool.js
│  │  │
│  │  ├─ data/
│  │  │  ├─ idols.js
│  │  │  ├─ surnames.js
│  │  │  └─ loader.js
│  │  │
│  │  ├─ ui/
│  │  │  ├─ dom.js
│  │  │  ├─ templates.js
│  │  │  └─ include.js
│  │  │
│  │  ├─ i18n/                     # ✨ 다국어 통합
│  │  │  ├─ index.js               # i18n 메인
│  │  │  ├─ en.js                  # 영어
│  │  │  └─ ko.js                  # 한국어
│  │  │
│  │  └─ utils/
│  │     ├─ fuzzy.js
│  │     └─ normalize.js
│  │
│  └─ data/                        # JSON 데이터
│     ├─ idols.json
│     ├─ surnames.json
│     └─ syllables.json
│
└─ 📁 tests/                       # 테스트 파일
   ├─ engine.spec.html
   └─ romanize.spec.html
```

---

### **Option B: 최소 변경** (빠른 정리)

```
kpop-idol-chemistry/
│
├─ 📄 README.md
├─ 📄 package.json
│
├─ 📁 .docs/                       # 숨김 폴더로 문서만 이동
│  ├─ strategy/
│  ├─ seo/
│  └─ phase/
│
├─ public/ (ads.txt 하나만 유지)
├─ assets/ → public/assets/로 이동
├─ images/ → public/assets/logos/로 이동
│
└─ (나머지 동일)
```

---

## 🚀 마이그레이션 계획

### **Phase 1: 문서 정리** (30분)
```bash
# 1. docs 폴더 생성 및 문서 이동
mkdir -p docs/{project,strategy,seo,pages,phase,style}

# 2. 문서 이동
mv SERVICE-ANALYSIS.md docs/project/
mv USER-ENGAGEMENT-STRATEGY.md docs/strategy/
mv CONTENT-IMPROVEMENT-PLAN.md docs/strategy/
mv ZERO-CLICK-OPTIMIZATION-PLAN.md docs/strategy/
mv SEO-CHECKLIST.md docs/seo/
mv REINDEX-GUIDE.md docs/seo/
mv BTS-PAGE-IMPROVEMENT-SUMMARY.md docs/pages/
mv HUNTRIX-SAJABOYS-SUMMARY.md docs/pages/
mv PHASE1-COMPLETION-SUMMARY.md docs/phase/
mv KITSCH-STYLE-CHECKLIST.md docs/style/
mv PROJECT-STRUCTURE-REFACTORING.md docs/project/

# 3. 문서 인덱스 생성
cat > docs/README.md << 'EOF'
# 📚 프로젝트 문서

## 디렉토리 구조
- `project/` - 프로젝트 관리 문서
- `strategy/` - 전략 및 개선 계획
- `seo/` - SEO 최적화 가이드
- `pages/` - 페이지별 개선 문서
- `phase/` - Phase별 완료 보고서
- `style/` - 디자인 가이드

## 주요 문서
- [서비스 분석](project/SERVICE-ANALYSIS.md)
- [사용자 참여 전략](strategy/USER-ENGAGEMENT-STRATEGY.md)
- [Phase 1 완료 보고서](phase/PHASE1-COMPLETION-SUMMARY.md)
EOF
```

---

### **Phase 2: 정적 파일 통합** (1시간)
```bash
# 1. 중복 제거
rm /ads.txt  # public/ads.txt 유지

# 2. 이미지 통합
mkdir -p public/assets/{social,logos}
mv assets/social/* public/assets/social/
mv images/* public/assets/logos/
rmdir assets/social assets images

# 3. 생성 도구 이동
mv assets/social/generate-images.html public/tools/

# 4. 경로 업데이트 필요
# - index.html의 이미지 경로
# - CSS의 이미지 경로
```

---

### **Phase 3: 소스 코드 재구성** (2-3시간)
```bash
# 1. src 폴더 생성
mkdir -p src

# 2. index.html은 루트에 유지 (배포 편의성)
# 또는 src/로 이동 후 빌드 프로세스 추가

# 3. JS 코드 모듈화
mkdir -p src/js/{core,features,i18n}

# 4. Phase 1 기능 분리
# - app.js에서 quick-generate, vs-mode, history 기능 추출
# - 별도 모듈로 분리
```

---

### **Phase 4: Pages 재구조화** (선택, 3-4시간)
```bash
# 페이지들을 카테고리별로 재구성
mkdir -p pages/{groups,features,info}

# 그룹별 페이지 이동
mkdir -p pages/groups/{bts,blackpink,seventeen,...}
mv pages/bts-name-generator pages/groups/bts/index.html
mv pages/bts-stage-name-generator pages/groups/bts/stage.html
mv pages/bts-aesthetic-name-generator pages/groups/bts/aesthetic.html
```

---

## ✅ 즉시 실행 가능한 정리 (Quick Wins)

### **1. 문서 정리** (추천 ⭐ - 10분)
```bash
mkdir -p docs/{project,strategy,seo,pages,phase,style}

# 핵심 문서만 루트에 유지
# - README.md
# - package.json
# - CNAME

# 나머지 모든 .md → docs/로 이동
```

### **2. 중복 파일 제거** (5분)
```bash
# ads.txt 중복 제거
rm ads.txt  # public/ads.txt만 유지
```

### **3. 이미지 통합** (10분)
```bash
mkdir -p public/assets/{social,logos}
# /images/ → /public/assets/logos/
# /assets/social/ → /public/assets/social/
```

---

## 📊 정리 후 예상 효과

### **Before (현재)**:
```
루트 디렉토리: 17개 항목 (혼잡)
- 13개 .md 문서
- 1개 중복 ads.txt
- 3개 이미지 폴더 분산
```

### **After (정리 후)**:
```
루트 디렉토리: 7개 항목 (깔끔)
- 3개 핵심 파일 (README, package.json, CNAME)
- 4개 핵심 폴더 (docs/, public/, src/, pages/)
```

### **개선 효과**:
- ✅ 프로젝트 구조 한눈에 파악 가능
- ✅ 문서 찾기 쉬움 (docs/ 아래 통합)
- ✅ 정적 파일 관리 일관성
- ✅ 배포 경로 명확화
- ✅ 신규 개발자 온보딩 시간 단축

---

## 🎯 추천 실행 순서

### **단계 1: 즉시 (오늘)** ⭐
1. ✅ 문서 정리 (docs/ 폴더 생성 및 이동)
2. ✅ 중복 파일 제거 (ads.txt)
3. ✅ 이미지 통합 (public/assets/)

**소요 시간**: 30분  
**리스크**: 낮음  
**효과**: 즉시 깔끔한 구조

---

### **단계 2: 이번 주 내** 
4. ⏳ 경로 업데이트 (HTML/CSS의 이미지 경로)
5. ⏳ components/ → src/components/로 이동

**소요 시간**: 1시간  
**리스크**: 중간 (경로 업데이트 필요)  
**효과**: 소스 코드 구조 개선

---

### **단계 3: 다음 Phase**
6. ⏳ JS 모듈화 (core/, features/ 분리)
7. ⏳ Pages 재구조화 (groups/, features/)

**소요 시간**: 3-4시간  
**리스크**: 높음 (대규모 리팩토링)  
**효과**: 장기적 유지보수성 향상

---

## 💡 실행 스크립트

### **Quick Start 스크립트**
```bash
#!/bin/bash
# refactor-quick.sh - 10분 안에 빠른 정리

echo "🚀 프로젝트 구조 빠른 정리 시작..."

# 1. docs 폴더 생성
mkdir -p docs/{project,strategy,seo,pages,phase,style}

# 2. 문서 이동
mv SERVICE-ANALYSIS.md docs/project/ 2>/dev/null
mv PROJECT-STRUCTURE-REFACTORING.md docs/project/ 2>/dev/null
mv USER-ENGAGEMENT-STRATEGY.md docs/strategy/ 2>/dev/null
mv CONTENT-IMPROVEMENT-PLAN.md docs/strategy/ 2>/dev/null
mv ZERO-CLICK-OPTIMIZATION-PLAN.md docs/strategy/ 2>/dev/null
mv SEO-CHECKLIST.md docs/seo/ 2>/dev/null
mv REINDEX-GUIDE.md docs/seo/ 2>/dev/null
mv BTS-PAGE-IMPROVEMENT-SUMMARY.md docs/pages/ 2>/dev/null
mv HUNTRIX-SAJABOYS-SUMMARY.md docs/pages/ 2>/dev/null
mv PHASE1-COMPLETION-SUMMARY.md docs/phase/ 2>/dev/null
mv KITSCH-STYLE-CHECKLIST.md docs/style/ 2>/dev/null

# 3. 중복 파일 제거
[ -f ads.txt ] && rm ads.txt && echo "✅ 중복 ads.txt 제거"

# 4. 이미지 통합
mkdir -p public/assets/{social,logos}
[ -d assets/social ] && cp -r assets/social/* public/assets/social/ && echo "✅ 소셜 이미지 통합"
[ -d images ] && cp -r images/* public/assets/logos/ && echo "✅ 로고 이미지 통합"

echo "✅ 완료! 루트 디렉토리가 깔끔해졌습니다."
```

저장 후 실행:
```bash
chmod +x refactor-quick.sh
./refactor-quick.sh
```

---

## 📝 다음 액션

### **지금 바로 할 것**:
1. ✅ 이 문서 검토
2. ✅ Quick Start 스크립트 실행
3. ✅ Git commit으로 변경사항 저장

### **이번 주 할 것**:
1. ⏳ 이미지 경로 업데이트
2. ⏳ 테스트 (모든 페이지 정상 작동 확인)
3. ⏳ 문서 인덱스 작성

---

**작성자**: AI Development Team  
**최종 업데이트**: 2025년 11월 5일  
**상태**: 제안 단계 → 승인 대기

