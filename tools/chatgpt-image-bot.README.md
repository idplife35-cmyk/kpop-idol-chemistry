# chatgpt-image-bot

ChatGPT 웹앱을 Playwright로 자동 조작해서 그룹 hero/logo 이미지 48장을 일괄 생성한다.

## 사용

```bash
# 1) 큐 시드 (최초 1회) — tools/image_queue.json 48 entries 생성
node tools/seed_image_queue.mjs            # 이미 있으면 거부
node tools/seed_image_queue.mjs --force    # 덮어쓰기
node tools/seed_image_queue.mjs --dry-run  # 출력만

# 2) 봇 실행 (Chromium 창이 뜸 — 처음에는 직접 ChatGPT 로그인)
node tools/chatgpt-image-bot.mjs                  # pending 전체
node tools/chatgpt-image-bot.mjs --only=hero      # hero 24개만
node tools/chatgpt-image-bot.mjs --only=logo      # logo 24개만
node tools/chatgpt-image-bot.mjs --only=p0        # P0 16개만
node tools/chatgpt-image-bot.mjs --only=p1
node tools/chatgpt-image-bot.mjs --only=p2
node tools/chatgpt-image-bot.mjs --resume         # status=pending만 재처리
```

세션은 `tools/.chrome-profile/`에 저장되어 다음 실행 때 재로그인 불필요(.gitignore에 추가됨). Ctrl+C로 중단 가능, 다음 실행 시 `--resume`으로 이어서.

## 정책

- 금기: 실인물 묘사, 실명 추가, photorealistic person, 봇 감지 회피 트릭.
- 출처 결정: `meetings/2026-06-09-image-strategy.md`, `product/image-plan-2026-06-15.md`.
- Selectors는 2026-06 ChatGPT UI 기준. UI가 바뀌면 `chatgpt-image-bot.mjs` 상단 `SELECTORS`만 손대면 된다.
