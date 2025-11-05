#!/bin/bash

# 서브페이지와 메인 페이지에서 중복 테마 스크립트 제거

echo "🧹 중복 테마 스크립트 제거 시작..."

# 제거할 스크립트 패턴 (다양한 변형 처리)
remove_theme_script() {
  local file="$1"
  
  # 파일 백업
  cp "$file" "${file}.bak"
  
  # 테마 스크립트 블록 제거 (여러 패턴 지원)
  # 패턴 1: const key = 'kitsch-theme' 로 시작하는 블록
  perl -i -0pe 's/<script>\s*\(function\(\)\{\s*const key = .kitsch-theme.;.*?\}\)\(\);\s*<\/script>//gs' "$file"
  
  # 패턴 2: 단독 스크립트 태그
  perl -i -0pe 's/<script>\s+\(function\(\)\{.*?kitsch-theme.*?\}\)\(\);\s+<\/script>//gs' "$file"
  
  # 백업 파일 삭제
  if diff -q "$file" "${file}.bak" > /dev/null; then
    echo "  ⏭️  $file - 변경사항 없음"
    rm "${file}.bak"
  else
    echo "  ✅ $file - 인라인 스크립트 제거 완료"
    rm "${file}.bak"
  fi
}

# 메인 페이지
echo ""
echo "📄 메인 페이지 처리 중..."
remove_theme_script "index.html"

# 서브페이지들
echo ""
echo "📄 서브페이지들 처리 중..."

pages=(
  "pages/bts-name-generator/index.html"
  "pages/blackpink-name-generator/index.html"
  "pages/newjeans-name-generator/index.html"
  "pages/ive-name-generator/index.html"
  "pages/seventeen-name-generator/index.html"
  "pages/stray-kids-name-generator/index.html"
  "pages/sajaboys-name-generator/index.html"
  "pages/huntrix-name-generator/index.html"
  "pages/bts-aesthetic-name-generator/index.html"
  "pages/blackpink-aesthetic-name-generator/index.html"
  "pages/newjeans-aesthetic-name-generator/index.html"
  "pages/ive-aesthetic-name-generator/index.html"
  "pages/seventeen-aesthetic-name-generator/index.html"
  "pages/stray-kids-aesthetic-name-generator/index.html"
  "pages/bts-stage-name-generator/index.html"
  "pages/blackpink-stage-name-generator/index.html"
  "pages/newjeans-stage-name-generator/index.html"
  "pages/ive-stage-name-generator/index.html"
  "pages/seventeen-stage-name-generator/index.html"
  "pages/stray-kids-stage-name-generator/index.html"
  "pages/huntrix-stage-name-generator/index.html"
  "pages/sajaboys-stage-name-generator/index.html"
  "pages/kpop-name-generator/index.html"
  "pages/kpop-stage-name-generator/index.html"
  "pages/kpop-stage-name-generator-female/index.html"
  "pages/kpop-stage-name-generator-male/index.html"
  "pages/kpop-username-generator/index.html"
  "pages/kpop-username-generator-female/index.html"
  "pages/kpop-username-generator-male/index.html"
  "pages/kpop-cute-name-generator/index.html"
  "pages/kpop-aesthetic-name-generator/index.html"
  "pages/kpop-badass-name-generator/index.html"
  "pages/kpop-ship-name-generator/index.html"
  "pages/kpop-couple-name-combiner/index.html"
  "pages/kpop-nickname-generator/index.html"
  "pages/kpop-bio-hashtag-generator/index.html"
  "pages/korean-name-generator/index.html"
  "pages/korean-romanized-name-generator/index.html"
  "pages/idol-chemistry-name/index.html"
  "pages/about/index.html"
  "pages/contact/index.html"
)

for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    remove_theme_script "$page"
  else
    echo "  ❌ $page - 파일 없음"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 완료! 중복 테마 스크립트 제거됨"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 이제 모든 페이지에서 app.js의 통합 테마 토글이 사용됩니다."

