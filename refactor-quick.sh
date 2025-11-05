#!/bin/bash
# refactor-quick.sh - 10분 안에 프로젝트 구조 빠른 정리

echo "🚀 프로젝트 구조 빠른 정리 시작..."
echo ""

# 1. docs 폴더 생성
echo "📁 1. docs 폴더 생성 중..."
mkdir -p docs/{project,strategy,seo,pages,phase,style}

# 2. 문서 이동
echo "📝 2. 문서 파일 이동 중..."
[ -f SERVICE-ANALYSIS.md ] && mv SERVICE-ANALYSIS.md docs/project/ && echo "  ✅ SERVICE-ANALYSIS.md → docs/project/"
[ -f PROJECT-STRUCTURE-REFACTORING.md ] && mv PROJECT-STRUCTURE-REFACTORING.md docs/project/ && echo "  ✅ PROJECT-STRUCTURE-REFACTORING.md → docs/project/"
[ -f USER-ENGAGEMENT-STRATEGY.md ] && mv USER-ENGAGEMENT-STRATEGY.md docs/strategy/ && echo "  ✅ USER-ENGAGEMENT-STRATEGY.md → docs/strategy/"
[ -f CONTENT-IMPROVEMENT-PLAN.md ] && mv CONTENT-IMPROVEMENT-PLAN.md docs/strategy/ && echo "  ✅ CONTENT-IMPROVEMENT-PLAN.md → docs/strategy/"
[ -f ZERO-CLICK-OPTIMIZATION-PLAN.md ] && mv ZERO-CLICK-OPTIMIZATION-PLAN.md docs/strategy/ && echo "  ✅ ZERO-CLICK-OPTIMIZATION-PLAN.md → docs/strategy/"
[ -f SEO-CHECKLIST.md ] && mv SEO-CHECKLIST.md docs/seo/ && echo "  ✅ SEO-CHECKLIST.md → docs/seo/"
[ -f REINDEX-GUIDE.md ] && mv REINDEX-GUIDE.md docs/seo/ && echo "  ✅ REINDEX-GUIDE.md → docs/seo/"
[ -f BTS-PAGE-IMPROVEMENT-SUMMARY.md ] && mv BTS-PAGE-IMPROVEMENT-SUMMARY.md docs/pages/ && echo "  ✅ BTS-PAGE-IMPROVEMENT-SUMMARY.md → docs/pages/"
[ -f HUNTRIX-SAJABOYS-SUMMARY.md ] && mv HUNTRIX-SAJABOYS-SUMMARY.md docs/pages/ && echo "  ✅ HUNTRIX-SAJABOYS-SUMMARY.md → docs/pages/"
[ -f PHASE1-COMPLETION-SUMMARY.md ] && mv PHASE1-COMPLETION-SUMMARY.md docs/phase/ && echo "  ✅ PHASE1-COMPLETION-SUMMARY.md → docs/phase/"
[ -f KITSCH-STYLE-CHECKLIST.md ] && mv KITSCH-STYLE-CHECKLIST.md docs/style/ && echo "  ✅ KITSCH-STYLE-CHECKLIST.md → docs/style/"

# 3. 문서 인덱스 생성
echo ""
echo "📚 3. 문서 인덱스 생성 중..."
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

### 프로젝트 관리
- [서비스 분석](project/SERVICE-ANALYSIS.md)
- [구조 리팩토링 계획](project/PROJECT-STRUCTURE-REFACTORING.md)

### 전략
- [사용자 참여 전략](strategy/USER-ENGAGEMENT-STRATEGY.md)
- [콘텐츠 개선 계획](strategy/CONTENT-IMPROVEMENT-PLAN.md)
- [제로클릭 최적화](strategy/ZERO-CLICK-OPTIMIZATION-PLAN.md)

### SEO
- [SEO 체크리스트](seo/SEO-CHECKLIST.md)
- [재색인 가이드](seo/REINDEX-GUIDE.md)

### 페이지별
- [BTS 페이지 개선](pages/BTS-PAGE-IMPROVEMENT-SUMMARY.md)
- [HUNTRIX & SajaBoys](pages/HUNTRIX-SAJABOYS-SUMMARY.md)

### Phase 보고서
- [Phase 1 완료 보고서](phase/PHASE1-COMPLETION-SUMMARY.md)

### 스타일 가이드
- [Kitsch 스타일 체크리스트](style/KITSCH-STYLE-CHECKLIST.md)
EOF
echo "  ✅ docs/README.md 생성 완료"

# 4. 중복 파일 제거
echo ""
echo "🗑️  4. 중복 파일 제거 중..."
if [ -f ads.txt ] && [ -f public/ads.txt ]; then
    rm ads.txt
    echo "  ✅ 루트의 중복 ads.txt 제거 (public/ads.txt 유지)"
elif [ -f ads.txt ]; then
    echo "  ⚠️  public/ads.txt가 없습니다. 루트 ads.txt를 유지합니다."
else
    echo "  ℹ️  ads.txt 이미 정리됨"
fi

# 5. 이미지 통합
echo ""
echo "🖼️  5. 이미지 파일 통합 중..."
mkdir -p public/assets/{social,logos}

# 소셜 이미지 복사
if [ -d assets/social ] && [ "$(ls -A assets/social 2>/dev/null)" ]; then
    cp -r assets/social/* public/assets/social/ 2>/dev/null
    echo "  ✅ 소셜 이미지 → public/assets/social/"
else
    echo "  ℹ️  assets/social/ 이미 정리됨 또는 비어있음"
fi

# 로고 이미지 복사
if [ -d images ] && [ "$(ls -A images 2>/dev/null)" ]; then
    cp -r images/* public/assets/logos/ 2>/dev/null
    echo "  ✅ 그룹 로고 → public/assets/logos/"
else
    echo "  ℹ️  images/ 이미 정리됨 또는 비어있음"
fi

# 6. 정리 확인
echo ""
echo "📊 6. 정리 결과 확인..."
echo ""
echo "루트 디렉토리 구조:"
ls -1 | head -15
echo ""

# 7. 완료 메시지
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 프로젝트 구조 정리 완료!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 다음 단계:"
echo "  1. 문서 확인: cd docs && ls -la"
echo "  2. Git 커밋: git add -A && git commit -m 'refactor: 프로젝트 구조 정리'"
echo "  3. 이미지 경로 업데이트 필요 (선택사항)"
echo "     - HTML/CSS에서 /images/ → /public/assets/logos/"
echo "     - /assets/social/ → /public/assets/social/"
echo ""
echo "⚠️  원본 파일 백업:"
echo "  - assets/ 와 images/ 폴더는 유지됨 (복사만 수행)"
echo "  - 확인 후 수동으로 삭제 가능: rm -rf assets images"
echo ""

