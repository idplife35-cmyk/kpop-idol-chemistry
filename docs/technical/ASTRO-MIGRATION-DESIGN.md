# 🚀 Astro 마이그레이션 설계서

> **문서 버전**: 1.0  
> **작성일**: 2025-12-21  
> **목적**: 현재 순수 HTML 프로젝트를 Astro로 마이그레이션하기 위한 설계

---

## 📁 프로젝트 구조

### 현재 구조 (As-Is)

```
kpop-idol-chemistry/
├── index.html                    # 메인 페이지 (수동)
├── pages/
│   ├── bts-name-generator/
│   │   └── index.html           # 각 페이지 수동 관리
│   ├── blackpink-name-generator/
│   │   └── index.html
│   └── ... (45개 HTML 파일)
├── js/
│   ├── app.js                   # 메인 로직 (~1800줄)
│   ├── generator/
│   │   ├── engine.js            # 이름 생성 엔진
│   │   ├── romanize.js          # 로마자 변환
│   │   ├── seed.js              # 시드 기반 랜덤
│   │   └── style-presets.js     # 관계 타입별 프리셋
│   ├── gamification/
│   │   ├── badge-system.js      # 배지 시스템
│   │   ├── level-system.js      # 레벨 시스템
│   │   └── stats.js             # 통계
│   └── data/
│       ├── idols.js             # 아이돌 데이터 로더
│       └── surnames.js          # 성씨 데이터 로더
├── data/
│   ├── idols.json               # 아이돌 데이터
│   ├── surnames.json            # 성씨 데이터
│   └── syllables.json           # 음절 데이터
├── css/
│   └── style.css                # 전체 스타일 (~700줄)
├── components/
│   ├── header.html              # 공통 헤더
│   └── footer.html              # 공통 푸터
└── public/
    ├── sitemap.xml              # 수동 관리
    └── robots.txt
```

### 신규 구조 (To-Be: Astro)

```
kpop-idol-chemistry-astro/
│
├── astro.config.mjs             # Astro 설정
├── package.json
├── tsconfig.json                # TypeScript 설정 (선택)
│
├── src/
│   │
│   ├── layouts/                 # 📐 레이아웃
│   │   ├── BaseLayout.astro     # 기본 HTML 구조
│   │   ├── GeneratorLayout.astro # 생성기 페이지용
│   │   └── LegalLayout.astro    # 법적 페이지용
│   │
│   ├── components/              # 🧩 컴포넌트
│   │   │
│   │   ├── common/              # 공통 컴포넌트
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── SEOHead.astro    # 메타태그, 스키마
│   │   │   └── AdSlot.astro     # 광고 슬롯
│   │   │
│   │   ├── generator/           # 생성기 관련
│   │   │   ├── GeneratorForm.astro      # 폼 (정적 부분)
│   │   │   ├── GeneratorFormClient.tsx  # 폼 (인터랙티브, React)
│   │   │   ├── MemberCard.astro         # 멤버 카드
│   │   │   ├── MemberGrid.astro         # 멤버 그리드
│   │   │   ├── ResultCard.astro         # 결과 카드
│   │   │   └── GroupBanner.astro        # 그룹 배너
│   │   │
│   │   ├── gamification/        # 게이미피케이션
│   │   │   ├── LevelBadge.astro
│   │   │   ├── BadgeGrid.astro
│   │   │   └── StatsModal.astro
│   │   │
│   │   ├── sections/            # 페이지 섹션
│   │   │   ├── HeroSection.astro
│   │   │   ├── QuickStart.astro
│   │   │   ├── VSMode.astro
│   │   │   ├── HistorySection.astro
│   │   │   └── FAQSection.astro
│   │   │
│   │   └── ui/                  # UI 요소
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       ├── GroupStory.astro  # 인스타 스토리 스타일
│   │       └── Notification.astro
│   │
│   ├── pages/                   # 📄 페이지 (자동 라우팅)
│   │   │
│   │   ├── index.astro          # 메인 페이지
│   │   │
│   │   ├── [group]-name-generator/
│   │   │   └── index.astro      # 동적 그룹 페이지
│   │   │
│   │   ├── [group]-stage-name-generator/
│   │   │   └── index.astro      # 동적 스테이지 네임
│   │   │
│   │   ├── [group]-aesthetic-name-generator/
│   │   │   └── index.astro      # 동적 aesthetic
│   │   │
│   │   ├── kpop-name-generator/
│   │   │   └── index.astro      # 일반 K-Pop
│   │   │
│   │   ├── korean-name-generator/
│   │   │   └── index.astro
│   │   │
│   │   ├── pages/               # 기타 페이지
│   │   │   ├── about/
│   │   │   │   └── index.astro
│   │   │   └── contact/
│   │   │       └── index.astro
│   │   │
│   │   └── legal/
│   │       ├── privacy.astro
│   │       └── terms.astro
│   │
│   ├── content/                 # 📊 콘텐츠 (데이터)
│   │   │
│   │   ├── config.ts            # 콘텐츠 스키마 정의
│   │   │
│   │   ├── groups/              # 그룹 데이터
│   │   │   ├── bts.json
│   │   │   ├── blackpink.json
│   │   │   ├── seventeen.json
│   │   │   ├── stray-kids.json
│   │   │   ├── newjeans.json
│   │   │   ├── ive.json
│   │   │   ├── aespa.json
│   │   │   ├── plave.json
│   │   │   ├── riize.json
│   │   │   ├── huntrix.json
│   │   │   └── sajaboys.json
│   │   │
│   │   └── faqs/                # FAQ 데이터
│   │       ├── bts.json
│   │       ├── blackpink.json
│   │       └── ...
│   │
│   ├── lib/                     # 🔧 유틸리티/로직
│   │   │
│   │   ├── generator/           # 기존 JS 로직 재사용
│   │   │   ├── engine.ts        # 이름 생성 엔진
│   │   │   ├── romanize.ts      # 로마자 변환
│   │   │   ├── seed.ts          # 시드 기반 랜덤
│   │   │   └── style-presets.ts # 관계 타입별 프리셋
│   │   │
│   │   ├── gamification/        # 게이미피케이션 (클라이언트)
│   │   │   ├── badge-system.ts
│   │   │   ├── level-system.ts
│   │   │   └── stats.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── seo.ts           # SEO 헬퍼
│   │   │   ├── schema.ts        # JSON-LD 생성
│   │   │   └── i18n.ts          # 다국어
│   │   │
│   │   └── types.ts             # 타입 정의
│   │
│   ├── styles/                  # 🎨 스타일
│   │   ├── global.css           # 전역 스타일
│   │   ├── variables.css        # CSS 변수
│   │   ├── kitsch-theme.css     # Kitsch 테마
│   │   └── components/          # 컴포넌트별 스타일
│   │       ├── header.css
│   │       ├── generator.css
│   │       └── cards.css
│   │
│   └── data/                    # 정적 데이터
│       ├── surnames.json
│       └── syllables.json
│
├── public/                      # 정적 파일 (그대로 복사)
│   ├── favicon.ico
│   ├── logo.svg
│   ├── robots.txt
│   ├── ads.txt
│   └── images/
│       ├── bts_logo.png
│       ├── black_pink_logo2.png
│       └── ...
│
└── dist/                        # 빌드 결과 (GitHub Pages 배포)
    ├── index.html
    ├── bts-name-generator/
    │   └── index.html
    └── ...
```

---

## 🧩 컴포넌트 설계

### 1. 레이아웃 계층

```
BaseLayout.astro
├── <!DOCTYPE html>
├── <html>
│   ├── <head>
│   │   └── SEOHead.astro (메타, 스키마, 스타일)
│   └── <body>
│       ├── Header.astro
│       ├── <slot />  ← 페이지 콘텐츠
│       ├── Footer.astro
│       └── 공통 스크립트
└── </html>

GeneratorLayout.astro (extends BaseLayout)
├── AdSlot (상단)
├── <slot />
├── AdSlot (중간)
├── FAQSection
└── AdSlot (하단)
```

### 2. 컴포넌트 의존성

```
index.astro (메인 페이지)
├── GeneratorLayout
│   ├── HeroSection
│   │   ├── GroupStories (인스타 스타일 캐러셀)
│   │   └── QuickInput
│   ├── GeneratorForm
│   │   ├── MemberGrid
│   │   │   └── MemberCard (x N)
│   │   └── GeneratorFormClient (React, 인터랙티브)
│   ├── VSMode
│   ├── HistorySection
│   └── FAQSection

[group]-name-generator/index.astro (그룹 페이지)
├── GeneratorLayout
│   ├── GroupBanner
│   ├── MemberGrid (필터된 멤버)
│   ├── GeneratorForm
│   └── GroupFAQ
```

---

## 📊 데이터 구조

### groups/*.json 스키마

```json
// src/content/groups/bts.json
{
  "id": "bts",
  "name": "BTS",
  "nameKr": "방탄소년단",
  "slug": "bts",
  "fandom": "ARMY",
  "company": "HYBE",
  "debutYear": 2013,
  "color": "#7B2B8F",
  "logo": "/images/bts_logo.png",
  "description": "Global K-Pop phenomenon...",
  "members": [
    {
      "id": "jungkook",
      "nameKr": "정국",
      "nameEn": "Jungkook",
      "gender": "male",
      "position": ["Main Vocalist", "Lead Dancer"],
      "birthYear": 1997
    },
    {
      "id": "jimin",
      "nameKr": "지민",
      "nameEn": "Jimin",
      "gender": "male",
      "position": ["Main Dancer", "Lead Vocalist"],
      "birthYear": 1995
    }
    // ... 나머지 멤버
  ],
  "seo": {
    "title": "BTS Name Generator | Create Your Korean Name with ARMY",
    "description": "Create your BTS name with all 7 members...",
    "keywords": ["bts name generator", "bts korean name", "army name"]
  },
  "pageTypes": ["name", "stage-name", "aesthetic"]
}
```

### faqs/*.json 스키마

```json
// src/content/faqs/bts.json
{
  "groupId": "bts",
  "questions": [
    {
      "question": "How does the BTS name generator work?",
      "answer": "Our generator uses..."
    },
    {
      "question": "Can I get a name like Jungkook?",
      "answer": "Yes! The generator..."
    }
    // ... 10개 FAQ
  ]
}
```

---

## 🔄 페이지 생성 전략

### 동적 라우팅 (getStaticPaths)

```astro
---
// src/pages/[group]-name-generator/index.astro

import { getCollection } from 'astro:content';
import GeneratorLayout from '../../layouts/GeneratorLayout.astro';
import GroupBanner from '../../components/generator/GroupBanner.astro';
import MemberGrid from '../../components/generator/MemberGrid.astro';
import GeneratorFormClient from '../../components/generator/GeneratorFormClient';
import FAQSection from '../../components/sections/FAQSection.astro';

// 빌드 시 모든 그룹 페이지 생성
export async function getStaticPaths() {
  const groups = await getCollection('groups');
  
  return groups
    .filter(g => g.data.pageTypes.includes('name'))
    .map(group => ({
      params: { group: group.data.slug },
      props: { group: group.data }
    }));
}

const { group } = Astro.props;
const faqs = await getCollection('faqs', f => f.data.groupId === group.id);
---

<GeneratorLayout 
  title={group.seo.title}
  description={group.seo.description}
  keywords={group.seo.keywords}
>
  <GroupBanner group={group} />
  
  <MemberGrid members={group.members} />
  
  <!-- React 컴포넌트: 인터랙티브 폼 -->
  <GeneratorFormClient 
    client:load 
    group={group}
    members={group.members}
  />
  
  <FAQSection questions={faqs[0]?.data.questions || []} />
</GeneratorLayout>
```

### 빌드 결과

```
npm run build 실행 시:

dist/
├── index.html
├── bts-name-generator/index.html      ← 자동 생성
├── blackpink-name-generator/index.html
├── seventeen-name-generator/index.html
├── stray-kids-name-generator/index.html
├── newjeans-name-generator/index.html
├── ive-name-generator/index.html
├── aespa-name-generator/index.html
├── plave-name-generator/index.html
├── riize-name-generator/index.html
├── huntrix-name-generator/index.html
├── sajaboys-name-generator/index.html
├── bts-stage-name-generator/index.html   ← pageTypes에 따라
├── bts-aesthetic-name-generator/index.html
└── ... (모든 조합 자동 생성)
```

---

## 🎨 스타일 전략

### CSS 구조

```css
/* src/styles/variables.css */
:root {
  /* Kitsch Light */
  --bg: #fff6fe;
  --surface: #ffffff;
  --text: #0E0E10;
  --accent: #FF2E8B;
  --accent-2: #B490FF;
  /* ... */
}

.dark {
  /* Kitsch Dark */
  --bg: #0E0E10;
  --surface: #15151a;
  --text: #f5f6ff;
  --accent: #FF2E8B;
  --accent-2: #4DFFDF;
}
```

```css
/* src/styles/global.css */
@import './variables.css';

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Rubik', system-ui, sans-serif;
}

/* 컴포넌트 스타일은 각 .astro 파일 내 <style> */
```

### 컴포넌트 스코프 스타일

```astro
<!-- MemberCard.astro -->
<div class="member-card">
  <img src={member.image} alt={member.nameEn} />
  <span class="name">{member.nameEn}</span>
</div>

<style>
  /* 이 컴포넌트에만 적용 (자동 스코핑) */
  .member-card {
    border-radius: 12px;
    background: var(--surface);
    transition: transform 0.2s;
  }
  
  .member-card:hover {
    transform: translateY(-4px);
  }
</style>
```

---

## ⚡ 인터랙티브 전략 (Islands)

### 정적 vs 인터랙티브 분리

```
페이지 구성 요소:
│
├── Header          → 정적 (Astro)
├── GroupBanner     → 정적 (Astro)
├── MemberGrid      → 정적 (Astro) + 클릭 이벤트 (inline JS)
│
├── GeneratorForm   → 🏝️ 인터랙티브 (React)
│   ├── 이름 입력
│   ├── 아이돌 선택
│   ├── 옵션 선택
│   ├── 생성 버튼
│   └── 결과 표시
│
├── VSMode          → 🏝️ 인터랙티브 (React)
├── HistorySection  → 🏝️ 인터랙티브 (React)
│
├── FAQSection      → 정적 (Astro) + 아코디언 (inline JS)
└── Footer          → 정적 (Astro)
```

### React 컴포넌트 하이드레이션

```astro
---
import GeneratorFormClient from '../components/GeneratorFormClient';
---

<!-- client:load = 페이지 로드 즉시 하이드레이션 -->
<GeneratorFormClient client:load group={group} />

<!-- client:visible = 뷰포트에 보일 때 하이드레이션 -->
<VSModeClient client:visible />

<!-- client:idle = 브라우저 유휴 시 하이드레이션 -->
<HistoryClient client:idle />
```

---

## 📦 마이그레이션 Phase

### Phase 1: 프로젝트 초기화 (1일)
- [ ] Astro 프로젝트 생성
- [ ] 기본 설정 (astro.config.mjs)
- [ ] 디렉토리 구조 생성
- [ ] 기존 CSS 이전
- [ ] 정적 파일 이전 (public/)

### Phase 2: 기본 레이아웃 (1일)
- [ ] BaseLayout.astro
- [ ] Header.astro
- [ ] Footer.astro
- [ ] SEOHead.astro

### Phase 3: 메인 페이지 (2일)
- [ ] index.astro 기본 구조
- [ ] HeroSection (인스타 스토리 캐러셀)
- [ ] GeneratorFormClient (React)
- [ ] 기존 generator JS 로직 이전

### Phase 4: 그룹 데이터 & 동적 페이지 (2일)
- [ ] groups/*.json 데이터 구조화
- [ ] [group]-name-generator 동적 라우팅
- [ ] MemberCard, MemberGrid 컴포넌트

### Phase 5: 추가 기능 (2일)
- [ ] VSMode 컴포넌트
- [ ] History/Favorites
- [ ] Gamification (배지, 레벨)
- [ ] FAQSection

### Phase 6: SEO & 최적화 (1일)
- [ ] sitemap 자동 생성 설정
- [ ] robots.txt
- [ ] 메타태그 최적화
- [ ] 광고 슬롯 배치

### Phase 7: 테스트 & 배포 (1일)
- [ ] 로컬 빌드 테스트
- [ ] GitHub Actions 설정
- [ ] GitHub Pages 배포
- [ ] 성능 측정

---

## 🔧 설정 파일

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kpopnamegenerator.com',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/legal/')
    })
  ],
  output: 'static',
  build: {
    format: 'directory'  // /page/index.html 형식
  }
});
```

### package.json

```json
{
  "name": "kpop-idol-chemistry",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/react": "^3.x",
    "@astrojs/sitemap": "^3.x",
    "react": "^18.x",
    "react-dom": "^18.x"
  }
}
```

---

## ✅ 체크리스트

### 마이그레이션 전 확인
- [ ] 기존 기능 목록 정리
- [ ] 기존 페이지 URL 목록 (리다이렉트 불필요하도록)
- [ ] 기존 데이터 구조 정리

### 마이그레이션 중 확인
- [ ] URL 구조 동일하게 유지
- [ ] 모든 메타태그 이전
- [ ] 모든 스키마 이전
- [ ] 기존 JS 로직 동작 확인

### 마이그레이션 후 확인
- [ ] 모든 페이지 접근 가능
- [ ] Core Web Vitals 측정
- [ ] Google Search Console 확인
- [ ] 광고 로드 테스트

---

## 📈 예상 효과

| 항목 | 현재 | Astro 후 |
|------|------|----------|
| 페이지 수 | 45 (수동) | 60+ (자동) |
| 새 그룹 추가 시간 | 2시간 | 5분 |
| 빌드 시간 | 없음 | ~30초 |
| 번들 크기 | ~300KB | ~50KB |
| LCP | ~2.5초 | ~1초 |
| sitemap 관리 | 수동 | 자동 |

---

## 🔗 참고

- [Astro 공식 문서](https://docs.astro.build/)
- [Astro + React](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Static Site Generation](https://docs.astro.build/en/guides/deploy/github/)

