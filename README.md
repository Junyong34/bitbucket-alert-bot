# Bitbucket alert bot

Bitbucket Webhook 이벤트를 감지하여 Slack 및 기타 메신저로 알림을 전송하는 Node.js 기반 Express 서버입니다.

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
| HTTP Method | Endpoint                  | 설명 |
|------------|---------------------------|------|
| POST       | `/webhook/bitbucket`       | Bitbucket Webhook 이벤트 수신 |
| GET        | `/config`                  | 현재 설정된 메신저 Webhook 조회 |
| POST       | `/config`                   | 새로운 Webhook 설정 추가 |

## 📦 설치 및 실행
```sh
git clone https://bitbucket.org/your-repo/bitbucket-alert-bot.git
cd bitbucket-alert-bot
npm install
