import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SlackWebhookModule } from '../src/slack-webhook/slack-webhook.module';
import { SlackWebhookService } from '../src/slack-webhook/slack-webhook.service';
import { INestApplication } from '@nestjs/common';

describe('SlackWebhookService (e2e)', () => {
  let app: INestApplication;
  let slackWebhookService: SlackWebhookService;
  let configService: ConfigService;

  // 테스트를 위한 가짜 환경변수 값
  const originalEnv = process.env;
  const mockWebhookUrl = 'https://hooks.slack.com/services/test/e2e/webhook';

  beforeAll(async () => {
    // 테스트를 위한 환경 변수 설정
    console.log(originalEnv);
    process.env = {
      ...originalEnv,
      SLACK_WEBHOOK_URL: mockWebhookUrl,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // e2e 테스트를 위해 process.env를 사용
        }),
        SlackWebhookModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    slackWebhookService = app.get<SlackWebhookService>(SlackWebhookService);
    configService = app.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    // 환경 변수 원상 복구
    process.env = originalEnv;
    await app.close();
  });

  it('should be defined', () => {
    expect(slackWebhookService).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should get SLACK_WEBHOOK_URL from actual ConfigService', () => {
    // ConfigService에서 실제로 값을 가져오는지 테스트
    const webhookUrl = configService.get<string>('SLACK_WEBHOOK_URL');
    expect(webhookUrl).toBe(mockWebhookUrl);
  });

  it('should initialize webhookUrl with the value from actual environment', () => {
    // 실제로 SlackWebhookService가 환경 변수의 값을 사용하는지 테스트
    const serviceAny = slackWebhookService as any; // private 변수에 접근하기 위해
    expect(serviceAny.webhookUrl).toBe(mockWebhookUrl);
  });

  it('should handle missing webhookUrl correctly', async () => {
    // ConfigService를 모킹하여 undefined 반환하도록 설정
    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'SLACK_WEBHOOK_URL') {
          return undefined;
        }
        return null;
      }),
    };

    // 새 모듈 생성 - 환경 변수가 아닌 모킹된 ConfigService 사용
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SlackWebhookService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    const newService =
      moduleFixture.get<SlackWebhookService>(SlackWebhookService);
    const newServiceAny = newService as any;

    // webhookUrl이 undefined인지 확인
    expect(newServiceAny.webhookUrl).toBeUndefined();
  });
});
