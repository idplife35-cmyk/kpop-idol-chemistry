# 🔧 SEO 기술 스택 업그레이드 계획

> **문서 버전**: 1.0  
> **작성일**: 2025-12-21  
> **목적**: SEO 최적화를 위한 기술 스택 개선 방안

---

## 📊 현재 기술 스택 분석

### As-Is
```
현재 스택:
├── HTML: 수동 작성 (45개 개별 파일)
├── CSS: 단일 파일 (style.css, ~700줄)
├── JS: ES6 Modules (번들링 없음)
├── 데이터: JSON 파일 (idols.json, etc.)
├── 호스팅: GitHub Pages (정적)
├── 빌드: 없음 ❌
└── 자동화: 없음 ❌
```

### 현재 문제점

| 문제 | 영향 | 심각도 |
|------|------|:------:|
| **수동 HTML 관리** | 페이지 추가/수정 시 중복 작업 | 🔴 높음 |
| **sitemap 수동 관리** | 새 페이지 추가 시 누락 위험 | 🔴 높음 |
| **번들링 없음** | 여러 JS 파일 개별 로드 → 성능 저하 | 🟡 중간 |
| **이미지 최적화 없음** | PNG/SVG 원본 사용 → 느린 로드 | 🟡 중간 |
| **CSS 분리 없음** | 전체 CSS 한 번에 로드 | 🟢 낮음 |

---

## 🎯 개선 옵션 비교

### Option A: 경량 빌드 시스템 (추천 ⭐)

**Vite + 간단한 템플릿 시스템**

```
장점:
✅ 빠른 개발 환경
✅ 자동 번들링/최적화
✅ 기존 코드 대부분 재사용 가능
✅ 학습 곡선 낮음
✅ GitHub Pages 호환

단점:
❌ SSG 기능 제한적
❌ 템플릿 시스템 직접 구현 필요
```

**구현 방법:**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { glob } from 'glob'

export default defineConfig({
  build: {
    rollupOptions: {
      input: glob.sync('**/*.html')
    }
  }
})
```

**예상 작업량**: 2-3일

---

### Option B: Static Site Generator (Astro)

**Astro 프레임워크 도입**

```
장점:
✅ 자동 sitemap 생성 (@astrojs/sitemap)
✅ 이미지 최적화 내장 (astro:assets)
✅ 컴포넌트 기반 개발
✅ 부분 하이드레이션 (최소 JS)
✅ 템플릿에서 데이터 바인딩
✅ SEO 최적화 플러그인 풍부

단점:
❌ 프로젝트 구조 변경 필요
❌ 학습 곡선 있음
❌ 마이그레이션 시간 소요
```

**예상 구조:**
```
src/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── MemberCard.astro
│   └── GeneratorForm.astro
├── layouts/
│   ├── BaseLayout.astro
│   └── GroupLayout.astro
├── pages/
│   ├── index.astro
│   ├── [group]-name-generator/
│   │   └── index.astro  (동적 라우팅)
│   └── [...slug].astro
├── data/
│   └── groups.json
└── styles/
    └── global.css
```

**예상 작업량**: 1-2주

---

### Option C: Next.js (SSG 모드)

**Next.js Static Export**

```
장점:
✅ 가장 강력한 SEO 기능
✅ 자동 이미지 최적화
✅ 자동 sitemap/robots
✅ 메타데이터 API
✅ 대규모 커뮤니티

단점:
❌ React 필수 (현재 Vanilla JS)
❌ 전체 재작성 필요
❌ 번들 크기 증가
❌ 오버엔지니어링 가능성
```

**예상 작업량**: 2-3주

---

### Option D: 현재 스택 + 자동화 스크립트

**스크립트 기반 자동화**

```
장점:
✅ 기존 코드 100% 유지
✅ 즉시 적용 가능
✅ 학습 필요 없음
✅ 점진적 개선

단점:
❌ 수동 관리 지속
❌ 빌드 최적화 제한
❌ 확장성 낮음
```

**구현 예:**
```bash
# generate-sitemap.js
node scripts/generate-sitemap.js

# generate-page.js [group]
node scripts/generate-page.js enhypen
```

**예상 작업량**: 1-2일

---

## 📋 추천 전략

### 단기 (즉시): Option D
현재 스택 유지하면서 자동화 스크립트 추가

```
scripts/
├── generate-sitemap.js     # sitemap 자동 생성
├── generate-group-page.js  # 그룹 페이지 템플릿 생성
├── update-lastmod.js       # lastmod 일괄 업데이트
└── validate-seo.js         # SEO 검증
```

### 중기 (1-2개월): Option B (Astro)
프로젝트 성장에 따라 Astro로 마이그레이션

**마이그레이션 단계:**
1. Astro 프로젝트 초기화
2. 공통 레이아웃 컴포넌트화
3. 메인 페이지 마이그레이션
4. 그룹 페이지 동적 라우팅
5. 기존 JS 로직 통합
6. 테스트 및 배포

---

## 🔧 즉시 적용 가능한 SEO 개선

### 1. sitemap.xml 자동 생성 스크립트

```javascript
// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://kpopnamegenerator.com';
const PAGES_DIR = './pages';

function getPages() {
  const pages = [];
  
  // 메인 페이지
  pages.push({ loc: '/', priority: '1.0', changefreq: 'weekly' });
  
  // pages 디렉토리 스캔
  const dirs = fs.readdirSync(PAGES_DIR);
  dirs.forEach(dir => {
    const indexPath = path.join(PAGES_DIR, dir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const priority = getPriority(dir);
      pages.push({
        loc: `/pages/${dir}/`,
        priority,
        changefreq: 'weekly'
      });
    }
  });
  
  return pages;
}

function getPriority(dir) {
  if (dir.includes('bts') || dir.includes('blackpink')) return '0.9';
  if (dir.includes('name-generator')) return '0.8';
  if (dir.includes('stage-name')) return '0.75';
  if (dir.includes('aesthetic')) return '0.75';
  return '0.7';
}

function generateSitemap(pages) {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// 실행
const pages = getPages();
const sitemap = generateSitemap(pages);
fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log(`✅ Sitemap generated with ${pages.length} pages`);
```

### 2. 페이지 템플릿 생성 스크립트

```javascript
// scripts/generate-group-page.js
const fs = require('fs');
const path = require('path');

const TEMPLATE = `<!doctype html>
<html lang="en">
<head>
  <!-- 공통 head 내용 -->
  <title>{{GROUP}} Name Generator | KPOP Idol Chemistry</title>
  <meta name="description" content="{{DESCRIPTION}}">
  <!-- ... -->
</head>
<body>
  <!-- 템플릿 내용 -->
</body>
</html>`;

function generatePage(group, members) {
  const html = TEMPLATE
    .replace(/{{GROUP}}/g, group)
    .replace(/{{DESCRIPTION}}/g, `Create your ${group} name...`);
  
  const dir = `./pages/${group.toLowerCase()}-name-generator`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  
  console.log(`✅ Created: ${dir}`);
}

// 사용: node scripts/generate-group-page.js ENHYPEN
const group = process.argv[2];
if (group) generatePage(group);
```

### 3. SEO 검증 스크립트

```javascript
// scripts/validate-seo.js
const fs = require('fs');
const path = require('path');

function validatePage(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  
  // 필수 메타 태그 체크
  if (!html.includes('<meta name="description"')) {
    errors.push('Missing meta description');
  }
  if (!html.includes('<link rel="canonical"')) {
    errors.push('Missing canonical URL');
  }
  if (!html.includes('application/ld+json')) {
    errors.push('Missing structured data');
  }
  if (!html.includes('hreflang')) {
    errors.push('Missing hreflang');
  }
  
  return errors;
}

// 모든 HTML 파일 검증
function validateAll() {
  const results = [];
  
  // pages 디렉토리 순회
  // ...
  
  return results;
}
```

---

## 📊 Core Web Vitals 개선

### 현재 예상 점수
| 지표 | 예상 | 목표 |
|------|------|------|
| LCP (Largest Contentful Paint) | ~2.5s | <2.5s ✅ |
| FID (First Input Delay) | ~50ms | <100ms ✅ |
| CLS (Cumulative Layout Shift) | ~0.15 | <0.1 ⚠️ |

### CLS 개선 방법
```css
/* 이미지 종횡비 예약 */
.group-logo {
  aspect-ratio: 16 / 9;
  width: 100%;
}

/* 폰트 로딩 최적화 */
.title-neon {
  font-display: swap;
}

/* 레이아웃 시프트 방지 */
.member-card {
  min-height: 200px;
}
```

### LCP 개선 방법
```html
<!-- 중요 리소스 프리로드 -->
<link rel="preload" href="/css/style.css" as="style">
<link rel="preload" href="/js/app.js" as="script">

<!-- 이미지 lazy loading -->
<img src="logo.png" loading="lazy" decoding="async">

<!-- Critical CSS 인라인 -->
<style>
  /* 첫 화면에 필요한 CSS만 인라인 */
</style>
```

---

## 🖼️ 이미지 최적화

### 현재 상태
- PNG/SVG 원본 사용
- WebP 미사용
- lazy loading 부분 적용

### 개선 방안

#### 1. WebP 변환
```bash
# ImageMagick 사용
for f in images/*.png; do
  convert "$f" -quality 80 "${f%.png}.webp"
done
```

#### 2. 반응형 이미지
```html
<picture>
  <source srcset="logo.webp" type="image/webp">
  <source srcset="logo.png" type="image/png">
  <img src="logo.png" alt="Logo" loading="lazy">
</picture>
```

#### 3. SVG 최적화
```bash
# SVGO 사용
npx svgo --input=images/*.svg --output=images/optimized/
```

---

## 📁 robots.txt 개선

```txt
# robots.txt for KPOP Idol Chemistry
User-agent: *
Allow: /

# Crawl-delay for politeness
Crawl-delay: 1

# Sitemap
Sitemap: https://kpopnamegenerator.com/sitemap.xml

# Block non-content directories
Disallow: /scripts/
Disallow: /tests/
Disallow: /*.sh$

# Block AI scrapers (optional)
User-agent: GPTBot
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: Google-Extended
Disallow: /
```

---

## 📋 구현 우선순위

### Phase 1: 즉시 (이번 주)
| 작업 | 예상 시간 | 영향도 |
|------|----------|--------|
| sitemap 생성 스크립트 | 2시간 | 높음 |
| sitemap.xml 업데이트 | 30분 | 높음 |
| robots.txt 개선 | 15분 | 중간 |

### Phase 2: 단기 (1-2주)
| 작업 | 예상 시간 | 영향도 |
|------|----------|--------|
| 페이지 생성 스크립트 | 4시간 | 높음 |
| SEO 검증 스크립트 | 2시간 | 중간 |
| 이미지 WebP 변환 | 2시간 | 중간 |

### Phase 3: 중기 (1개월)
| 작업 | 예상 시간 | 영향도 |
|------|----------|--------|
| Astro 마이그레이션 검토 | 평가 | - |
| Core Web Vitals 최적화 | 1주 | 높음 |
| 자동 배포 파이프라인 | 4시간 | 중간 |

---

## 🔗 참고 자료

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Core Web Vitals](https://web.dev/vitals/)
- [Astro Documentation](https://docs.astro.build/)
- [Vite Documentation](https://vitejs.dev/)
- [Schema.org](https://schema.org/)

---

## ✅ 다음 단계

1. **즉시**: sitemap 생성 스크립트 작성 및 실행
2. **이번 주**: 누락된 페이지 sitemap에 추가
3. **다음 주**: 페이지 템플릿 자동화
4. **다음 달**: Astro 마이그레이션 POC

