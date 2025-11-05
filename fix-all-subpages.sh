#!/bin/bash

echo "🔧 모든 서브페이지에 app.js 추가 시작..."

count=0
for dir in pages/*/; do
  html="${dir}index.html"
  
  if [ ! -f "$html" ]; then
    continue
  fi
  
  # app.js가 이미 있는지 확인
  if grep -q 'src="/js/app.js"' "$html" || grep -q 'src="../../js/app.js"' "$html" || grep -q 'src="/js/i18n.js"' "$html"; then
    echo "  ⏭️  $html - 이미 app.js/i18n.js가 있음"
    continue
  fi
  
  # include.js를 찾아서 그 앞에 추가
  if grep -q 'src="/js/ui/include.js"' "$html"; then
    # include.js 앞에 app.js와 i18n.js 추가
    sed -i.bak 's|<script type="module" src="/js/ui/include.js"|<script type="module" src="/js/i18n.js" defer></script>\n  <script type="module" src="/js/app.js" defer></script>\n  <script type="module" src="/js/ui/include.js"|' "$html"
    rm "${html}.bak"
    echo "  ✅ $html"
    ((count++))
  else
    echo "  ⚠️  $html - include.js 없음"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 완료! $count개의 페이지에 app.js 추가됨"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

