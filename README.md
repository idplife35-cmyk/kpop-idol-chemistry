

# 🎤 KPOP Idol Chemistry

정적 웹사이트 기반 **아이돌 케미 이름 생성기** 프로젝트입니다.  
내 이름과 좋아하는 아이돌을 입력하면, 절친/파트너/애인 등 다양한 관계 타입에 맞춰 새로운 이름과 케미 지수를 생성합니다.

---

## 🚀 특징
- 100% **정적 웹사이트** (서버/DB 불필요, GitHub Pages/Netlify 배포 가능)
- **아이돌 데이터 (idols.json)** 기반 자동완성 + 퍼지 매칭
- **성별 선택 (남/여/자동)** 및 관계 타입 (절친/무대 파트너/반 친구/드라마 주인공/애인)
- 결과:  
  - 아이돌 이름 그대로 성씨만 바꾼 **SameName** 버전  
  - 스타일 변형된 **Styled** 버전  
  - 케미 지수(70~100%) + 관계별 코멘트
- **SEO/광고 최적화**: robots.txt, sitemap.xml, ads.txt 포함
- **Privacy by Design**: 모든 입력은 **브라우저에서만 처리**, 서버 저장 없음

---

## 📂 프로젝트 구조

```
kpop-idol-chemistry/
├─ index.html              # 메인 페이지
├─ css/style.css           # 공통 스타일
├─ js/
│  ├─ app.js               # 메인 진입점
│  ├─ generator/
│  │  ├─ engine.js         # 이름 생성 알고리즘
│  │  ├─ romanize.js       # 한글 → 영문 변환
│  │  ├─ seed.js           # 시드/랜덤 유틸
│  │  ├─ style-presets.js  # 관계 타입별 스타일 설정
│  │  └─ syllable-pool.js  # 음절 풀 로더
│  ├─ data/
│  │  ├─ idols.js          # 아이돌 데이터 로더
│  │  ├─ surnames.js       # 성씨 데이터 로더
│  │  └─ loader.js         # JSON fetch 유틸
│  ├─ ui/
│  │  ├─ dom.js            # DOM 유틸
│  │  ├─ templates.js      # 결과 렌더링 템플릿
│  │  └─ i18n.js           # 다국어 레이블/문구
│  └─ util/
│     ├─ normalize.js      # 입력 정규화
│     └─ fuzzy.js          # 퍼지 매칭
├─ data/
│  ├─ idols.json           # 아이돌 목록
│  ├─ surnames.json        # 성씨 목록
│  └─ syllables.json       # 음절 풀
├─ public/
│  ├─ robots.txt           # 크롤러 접근 설정
│  ├─ sitemap.xml          # 사이트맵
│  └─ ads.txt              # AdSense ID
├─ legal/
│  ├─ privacy.html         # 개인정보 처리방침
│  └─ terms.html           # 이용 약관
├─ components/
│  ├─ header.html          # 공통 헤더
│  └─ footer.html          # 공통 푸터
├─ tests/
│  └─ engine.spec.html     # 알고리즘 테스트 페이지
└─ README.md
```

---

## 🛠 실행 방법

### 1. 로컬 테스트
```bash
# 간단한 로컬 서버 실행
npx http-server -c-1 -p 5173 .
```
이후 `http://localhost:5173` 접속.

### 2. 배포
- GitHub Pages, Netlify, Vercel 등 정적 호스팅 서비스 사용
- `robots.txt`, `sitemap.xml`, `ads.txt`가 루트에 노출되는지 확인

---

## 📜 라이선스
이 프로젝트는 학습/연습용으로 제작되었습니다.  
아이돌 그룹명과 멤버 이름은 각 소속사/권리자에게 귀속됩니다.