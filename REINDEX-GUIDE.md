# 🔄 재색인 요청 가이드

## 배경
2025년 10월 21일에 8개 주요 그룹 페이지의 콘텐츠를 대폭 개선했습니다.
- 평균 30-70% 콘텐츠 증가
- JSON-LD 구조화 데이터 추가
- 멤버 가이드, FAQ 확장 등

## ⚡ 해야 할 일: 개별 URL 재색인 요청

### 방법 1: Google Search Console (권장)

1. **접속**: https://search.google.com/search-console
2. **상단 검색창**에 URL 하나씩 입력
3. **"색인 생성 요청"** 버튼 클릭
4. 1-2분 대기 후 다음 URL

### 📋 재색인 요청할 URL 목록 (8개)

```
1. https://kpopnamegenerator.com/pages/bts-name-generator/
   → 755줄 → 1,432줄 (+90% 증가)

2. https://kpopnamegenerator.com/pages/blackpink-name-generator/
   → 706줄 → 1,216줄 (+72% 증가)

3. https://kpopnamegenerator.com/pages/seventeen-name-generator/
   → 854줄 → 1,008줄 (+18% 증가)

4. https://kpopnamegenerator.com/pages/stray-kids-name-generator/
   → 768줄 → 898줄 (+17% 증가)

5. https://kpopnamegenerator.com/pages/newjeans-name-generator/
   → 720줄 → 876줄 (+22% 증가)

6. https://kpopnamegenerator.com/pages/ive-name-generator/
   → 735줄 → 897줄 (+22% 증가)

7. https://kpopnamegenerator.com/pages/huntrix-name-generator/
   → 686줄 → 885줄 (+29% 증가)

8. https://kpopnamegenerator.com/pages/sajaboys-name-generator/
   → 820줄 → 994줄 (+21% 증가)
```

**예상 소요 시간:** 10-15분
**예상 반영 시간:** 2-3일 내 재크롤링 시작

---

### 방법 2: robots.txt 확인 (자동화)

현재 robots.txt에 sitemap 위치가 명시되어 있는지 확인:

```
Sitemap: https://kpopnamegenerator.com/sitemap.xml
```

이미 있다면 OK! 없다면 추가하세요.

---

## 📊 모니터링

### 1주일 후 확인사항:
- Google Search Console → 커버리지 → 색인 생성됨
- 개선된 8개 페이지가 "색인 생성됨"으로 표시되는지 확인

### 2-4주 후 확인사항:
- 검색 노출 증가 여부
- 클릭률 변화
- 평균 게재 순위 변화

---

## ❓ FAQ

**Q: Sitemap을 다시 제출해야 하나요?**
A: 아니요! Sitemap 파일 자체는 변하지 않았으므로 재제출 불필요. **개별 URL 재색인 요청**이 중요합니다.

**Q: 8개 URL 모두 요청해야 하나요?**
A: 권장합니다. 하지만 최소한 트래픽이 많은 BTS, BLACKPINK, SEVENTEEN만이라도 요청하세요.

**Q: 재색인 요청 안 하면?**
A: Google이 자연스럽게 재크롤링할 때까지 2-4주 소요될 수 있습니다.

**Q: 매번 콘텐츠 수정할 때마다 해야 하나요?**
A: 대규모 업데이트 시에만 권장. 사소한 수정은 자동 재크롤링 대기해도 OK.



