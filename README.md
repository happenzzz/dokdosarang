# 독도울림 Cloudflare 전환용 프로젝트

이 폴더는 기존 Firebase 독도울림을 Codex + GitHub + Cloudflare Workers 방식으로 옮기기 위한 베이스 프로젝트입니다.

## 구조
- `src/index.ts`: Cloudflare Worker + Durable Object 실시간 서버
- `public/index.html`: 기존 독도울림 HTML
- `public/style.css`: 기존 HTML에서 분리한 CSS
- `public/game.js`: 기존 HTML에서 분리한 게임 JS
- `public/assets/`: 기존 캐릭터/맵 이미지
- `wrangler.jsonc`: Cloudflare 설정

## 현재 상태
기존 화면/자산/게임 코드는 보존되어 있습니다. Worker와 Durable Object 실시간 서버 뼈대도 추가했습니다.

다만 기존 `game.js` 내부의 Firebase Auth / Firestore / Storage / Realtime Database 호출은 아직 Cloudflare API로 완전히 교체되지 않았습니다. 따라서 Cloudflare 배포 구조는 준비됐지만, 교사 Google 로그인·작품 DB·파일 업로드·기존 실시간 접속 기능의 완전한 이전은 다음 단계에서 Codex로 교체해야 합니다.

## 실행
```powershell
npm.cmd install
npx.cmd wrangler dev
```

## 배포
```powershell
npx.cmd wrangler login
npx.cmd wrangler deploy
```

## Codex에게 다음 단계로 시킬 권장 요청
`이 저장소는 기존 Firebase 기반 독도울림을 Cloudflare로 이전 중이다. public/game.js 안의 Firebase Authentication, Firestore, Storage, Realtime Database 의존성을 분석한 뒤, 캐릭터 실시간 이동/접속자/채팅은 src/index.ts의 Durable Object WebSocket을 사용하도록 완전히 교체하고, 작품/학생/설정 데이터는 Cloudflare D1, 첨부파일은 R2를 사용하도록 순차적으로 이전해라. 기존 UI, 맵, 캐릭터, 충돌 영역, 이동 로직은 변경하지 말고 기능 회귀가 없도록 작업해라.`
