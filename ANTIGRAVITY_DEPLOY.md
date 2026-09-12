# 관리자 계정 추가 업데이트

관리자 Google 계정: happenz@naver.com, daesin24841@gmail.com

public/index.html, firestore.rules, storage.rules 세 파일을 기존 폴더의 같은 위치에 덮어쓰고 실행하세요.

```powershell
firebase.cmd deploy --only "hosting,firestore:rules,storage" --project dokdosarang
```

배포 완료 후 Ctrl+F5로 새로 고치고 교사 버튼에서 원하는 Google 계정을 선택하세요.

---

# 채팅 말풍선·교사 삭제 기능 업데이트

말풍선은 새 채팅을 보낸 시점부터 5초간 표시됩니다. 새 말을 보내면 교체됩니다. 친구 화면에도 받은 채팅이 캐릭터 위에 나타납니다.
교사 로그인 시 채팅창 각 메시지에 삭제 버튼이 표시됩니다. 관리 → 데이터 관리 → 채팅 기록 전체 삭제로 이전 기록을 모두 지울 수 있습니다. 삭제는 모든 접속자에게 반영되며 확인창을 거칩니다.

이전 로그인·친구 캐릭터 수정본을 이미 배포했다면, ZIP의 public/index.html을 기존 폴더의 같은 위치에 덮어쓰고 실행하세요.

```powershell
firebase.cmd deploy --only hosting --project dokdosarang
```

이전 접속 오류 수정본을 아직 적용하지 않았다면 database.rules.json도 덮어쓰고 실행하세요.

```powershell
firebase.cmd deploy --only database --project dokdosarang
firebase.cmd deploy --only hosting --project dokdosarang
```

완료 후 모든 기기에서 새로 고침하세요. PC는 Ctrl+F5입니다. 채팅 삭제에는 앞서 배포한 firestore.rules의 교사 전용 삭제 권한을 사용합니다.

---

# 이미 배포한 dokdosarang 프로젝트의 로그인·접속자 수정

이 ZIP에서 다음 두 파일을 기존 Antigravity 폴더의 같은 위치에 덮어씁니다.
- public/index.html
- database.rules.json

이미 사용 중인 프로젝트 연결 파일이나 Firestore·Storage 규칙을 변경할 필요는 없습니다.
기존 폴더의 터미널에서 순서대로 실행합니다.

```powershell
firebase.cmd deploy --only database --project dokdosarang
firebase.cmd deploy --only hosting --project dokdosarang
```

두 명령 모두 Deploy complete!가 나온 뒤 모든 기기에서 박물관 페이지를 새로 고칩니다. PC는 Ctrl+F5로 새로 고침하세요.
서로 다른 두 기기에서 이름을 정하고 접속 인원·캐릭터가 보이는지, 교사 Google 로그인 창이 열리는지 확인합니다.
교사 허용 계정은 기존과 같이 `happenz@naver.com`입니다. 해당 이메일로 등록된 Google 계정을 선택하세요.
규칙 파일은 UTF-8 BOM 없이 저장되어 있습니다. PowerShell의 Set-Content 명령으로 다시 변환하지 마세요.

---

# 독도울림박물관 — 24명 함께 사용하기

## 1. 완성본 열기
ZIP을 풀고 `dokdo_ullim_firebase` 폴더를 Antigravity에서 엽니다.
`firebase.json`과 `public` 폴더가 함께 보이는 위치가 맞습니다. HTML을 더블클릭하면 서버가 연결되지 않습니다.

## 2. Firebase 콘솔 준비 (처음 한 번)
https://console.firebase.google.com/

다른 수업 앱의 규칙이 바뀌지 않도록 **독도박물관 전용 새 Firebase 프로젝트**를 만드세요. 아래 배포는 선택한 프로젝트의 Firestore·Realtime Database·Storage 규칙을 교체합니다. 기존 질문몬/부설이 프로젝트에 그대로 배포하지 마세요.

1. 프로젝트 설정 → 일반에서 프로젝트 ID를 확인합니다. 표시 이름과 다릅니다.
2. 웹 앱(</>)을 하나 등록합니다. Firebase Hosting 예약 주소로 설정을 자동으로 받으므로 HTML에 API 키를 붙이지 않습니다.
3. Authentication → 시작하기 → 로그인 방법에서 **익명**과 **Google**을 사용 설정합니다. Google 설정에는 지원 이메일을 지정합니다.
4. Firestore Database → 데이터베이스 만들기 → 기본 `(default)` 데이터베이스, 프로덕션 모드로 생성합니다.
5. Realtime Database → 데이터베이스 만들기 → 잠금 모드로 생성합니다. 이 프로젝트의 기본 데이터베이스 하나를 사용합니다.
6. 사진·영상·PDF 첨부 기능을 위해 **Blaze 요금제**를 연결하고 Storage → 시작하기에서 기본 버킷을 생성합니다. 예산 알림을 설정하세요. 비용은 실제 전송량에 따라 달라지며 무료/월 1,000원을 보장하지 않습니다.

## 3. 교사 계정 확인
원본에 들어 있던 `happenz@naver.com`을 그대로 유지했습니다. **이 이메일로 된 Google 계정**이어야 합니다.
다른 계정으로 관리하려면 아래 세 파일의 이메일을 모두 같은 값으로 변경하세요.
- `public/index.html`의 `TEACHER_EMAILS`
- `firestore.rules`
- `storage.rules`

학생은 이름과 캐릭터를 정하면 익명 인증으로 입장합니다. 같은 기기·브라우저의 계정을 유지하므로 작품 삭제 권한도 유지됩니다. 브라우저 데이터 삭제/시크릿 창 종료 후에는 이전 작품을 교사가 관리해야 합니다. 학생마다 각자 기기를 사용하세요.

## 4. Antigravity 터미널 명령어 (Windows PowerShell)
Node.js LTS를 설치한 뒤 Antigravity를 완전히 종료하고 다시 켭니다.
아래 명령을 한 줄씩 실행하세요. `.cmd`를 붙여 PowerShell의 npm.ps1 실행 정책 오류를 피합니다.

```powershell
node -v
npm.cmd -v
npm.cmd install -g firebase-tools
firebase.cmd login
firebase.cmd projects:list
firebase.cmd use --add
```
`use --add`에서 **새로 만든 독도박물관 프로젝트**를 선택하고 별칭은 `default`로 입력합니다.
Gemini 기능 사용 여부와 사용 통계 전송 여부는 둘 다 `n`을 선택해도 배포에 지장이 없습니다.

선택한 프로젝트를 확인한 뒤 배포합니다.

```powershell
firebase.cmd use
firebase.cmd deploy --only hosting,firestore:rules,database,storage
```
`firebase init`은 필요 없습니다. 이미 설정 파일이 포함되어 있습니다.
완료 후 표시되는 `Hosting URL`을 크롬에서 엽니다. 보통 `https://프로젝트ID.web.app` 형태입니다.

화면·이미지만 수정한 다음 배포할 때:

```powershell
firebase.cmd deploy --only hosting
```
교사 이메일/규칙도 수정했다면 처음 배포 명령을 다시 실행합니다.

## 5. 24명 수업 시작
1. 교사가 Hosting URL을 열고 이름·캐릭터를 설정합니다.
2. 상단의 연결 표시가 **실시간 연결**인지 확인합니다.
3. 같은 링크를 24명에게 공유합니다. 24명이 같은 박물관에서 움직이고 채팅·전시물을 공유합니다.
4. 스마트패드는 가로로 놓고 화면 이동 조작을 사용합니다. PC는 방향키/WASD를 사용합니다.
5. 교사는 교사 버튼으로 Google 로그인 후 작품과 학생 목록을 관리합니다.

24명 동시 이용을 목표로 구성했으며 25번째 접속을 강제로 차단하지 않습니다. 학생 24명과 교사가 함께 들어갈 수 있습니다. 링크를 아는 사용자가 들어오는 수업용 구성으로, 학급 명단 인증이나 비밀번호 제한은 없습니다. 교사의 학생 목록 삭제/비활성화는 계정 접속 차단 기능이 아닙니다.

## 6. 실제 배포 후 확인
- 기기 두 대에서 서로의 이름·이동·반응이 보이는지 확인합니다.
- 학생 A의 작품·채팅이 B에게 나타나는지 확인합니다.
- 학생 B에게 A 작품 삭제 버튼이 없는지, 교사는 삭제할 수 있는지 확인합니다.
- 한 기기를 닫은 뒤 접속 목록에서 사라지는지 확인합니다. 네트워크 단절 감지에는 잠시 시간이 걸릴 수 있습니다.
- 사진 하나를 올려 다른 기기에서 열리는지 확인합니다.
- 수업 전 24명 동시 접속 상태에서 교내 Wi-Fi로 이동·전시를 확인합니다.

## 7. 연결이 안 될 때
- 익명 인증 오류: Authentication에서 익명을 사용 설정하세요.
- `permission-denied`: 프로젝트 선택과 세 종류 규칙 배포 여부를 확인하세요. 규칙을 전체 허용으로 바꾸지 마세요.
- 이동만 연결 실패: Realtime Database가 생성되어 있는지 확인하세요. 생성 후 페이지를 새로 고치세요.
- 사진 업로드 실패: Blaze 연결, Storage 기본 버킷, Storage 규칙을 확인하세요.
- Google `unauthorized-domain`: Authentication → 설정 → 승인된 도메인에 Hosting 주소의 도메인을 추가하세요.
- 교사 권한 없음: 세 파일의 이메일과 실제 Google 계정 이메일이 같은지 확인하고 다시 배포하세요.

## 구성과 확인 범위
- 위치: Realtime Database, 이동 중 약 0.2초 간격, 정지 시 20초 간격 확인, 서버 연결 종료 시 접속 정보 제거.
- 작품·학생·채팅: Firestore 실시간 구독. 파일: Storage (파일당 25MB).
- 지도·캐릭터 등 원본 이미지 18개 분리. 원본 이동 경로·충돌 마스크와 스마트패드 조작 유지.
- Cloud Functions 배포는 필요 없습니다.
- 로컬 JavaScript 문법 및 동기화 로직 검증 결과는 `VERIFICATION.md`에 있습니다. 사용자 Firebase 계정에 배포하거나 실제 24기기 네트워크 테스트를 수행한 상태는 아닙니다.

공식 참고:
- 접속 종료 처리: https://firebase.google.com/docs/database/web/offline-capabilities
- Hosting 자동 설정: https://firebase.google.com/docs/hosting/reserved-urls
- Storage 요금제 요구 사항: https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024
