# Bitbucket Alert Bot

Bitbucket Webhook 이벤트를 감지하여 Slack 및 기타 메신저로 알림을 전송하는 Node.js 기반 Express 서버입니다.

## 기능

- Bitbucket Webhook 이벤트 수신 및 처리
- 다양한 이벤트 타입 지원 (Push, PR, Issue 등)
- Slack과 Discord 알림 지원

## 기술 스택

- Node.js
- TypeScript 5
- Express.js
- ESLint, Prettier

## 설치 및 실행

### 필수 조건

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/bitbucket-alert-bot.git
cd bitbucket-alert-bot

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

`.env` 파일을 편집하여 필요한 설정을 입력하세요:

```env
PORT=3000
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
```

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Bitbucket Webhook 설정

1. Bitbucket 저장소 설정에서 Webhooks 메뉴로 이동
2. "Add webhook" 버튼 클릭
3. 다음 정보 입력:
   - Title: "Alert Bot"
   - URL: `https://your-server.com/webhook/bitbucket`
   - Status: Active
   - Triggers: 원하는 이벤트 선택 (Repository push, Pull request created 등)
4. "Save" 버튼 클릭

## 메신저 연동

### Slack

1. Slack 워크스페이스에서 "incoming webhook" 앱을 추가
2. 웹훅 URL을 생성하고 `.env` 파일의 `SLACK_WEBHOOK_URL`에 추가

### Discord

1. Discord 서버 설정에서 "Integrations" 메뉴로 이동
2. "Webhooks" 항목에서 새 웹훅 생성
3. 웹훅 URL을 복사하여 `.env` 파일의 `DISCORD_WEBHOOK_URL`에 추가

## 라이센스

MIT

## 🔥 주요 기능

- Bitbucket PR 생성, 리뷰, 코멘트 등의 이벤트 감지
- 감지된 이벤트를 특정 메신저(Webhook URL)에 맞는 포맷으로 변환하여 전송
- 각 채팅방별로 다른 Webhook URL 설정 가능
- Express API를 통해 설정 및 이벤트 관리 가능
- 보안 설정 (API Key 또는 인증 방식 추가 예정)

## 지원 메신저

- Slack
- 기타 웹훅 지원 메신저

## 🚀 기술 스택

- **Node.js** + **Express**
- **Bitbucket Webhook**
- **dotenv** (환경 변수 관리)
- **Axios** (HTTP 요청)

## 📌 API 경로 (예시)

| HTTP Method | Endpoint             | 설명                            |
| ----------- | -------------------- | ------------------------------- |
| POST        | `/webhook/bitbucket` | Bitbucket Webhook 이벤트 수신   |
| GET         | `/config`            | 현재 설정된 메신저 Webhook 조회 |
| POST        | `/config`            | 새로운 Webhook 설정 추가        |

## 📦 설치 및 실행

```sh
git clone https://bitbucket.org/your-repo/bitbucket-alert-bot.git
cd bitbucket-alert-bot
npm install
```
