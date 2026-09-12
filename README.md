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
기존 화면, 독도 지도, 캐릭터 이미지, 이동 물리, 충돌 마스크, 전시관 입구와 길찾기는 그대로 보존되어 있습니다.

- 학생 접속/퇴장, 캐릭터 위치·방향·아바타, 반응, 채팅: Cloudflare Durable Objects + WebSocket
- 최근 채팅 40개: Durable Object storage
- 교사 Google 로그인: 기존 Firebase Authentication 코드 유지
- 박물관 설정·전시물·학생 명부: 기존 Firestore 코드 유지
- 작품 첨부파일: 기존 Firebase Storage 코드 유지

Cloudflare 정적 배포에는 현재 Firebase SDK/config가 포함되어 있지 않으므로, Firebase 쪽 기능은 별도 설정 전까지 기기 미리보기로 동작합니다. 실시간 접속자·이동·채팅은 Firebase와 독립적으로 Cloudflare에서 동작합니다.

## 실행
```powershell
npm.cmd install
npx.cmd wrangler dev
```

검증:

```powershell
npm.cmd run check
```

## 배포
```powershell
npx.cmd wrangler login
npx.cmd wrangler deploy
```

## 다음 전환 단계
Firebase SDK/config를 연결해 남겨 둔 Auth·Firestore·Storage 기능을 그대로 사용할 수 있습니다. Firebase를 완전히 제거하려면 교사 인증, 작품/학생/설정 데이터, 첨부파일을 각각 별도 단계로 설계해 D1/R2 등으로 옮겨야 합니다.
