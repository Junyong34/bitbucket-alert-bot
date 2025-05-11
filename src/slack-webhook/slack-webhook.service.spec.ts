import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SlackWebhookService } from './slack-webhook.service';
import { Logger } from '@nestjs/common';

describe('SlackWebhookService', () => {
  let service: SlackWebhookService;
  let configService: ConfigService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'SLACK_WEBHOOK_URL') {
          return 'https://hooks.slack.com/services/test/webhook';
        }
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlackWebhookService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SlackWebhookService>(SlackWebhookService);
    configService = module.get<ConfigService>(ConfigService);

    // Logger spy 설정
    loggerSpy = jest.spyOn(Logger.prototype, 'warn');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get SLACK_WEBHOOK_URL from ConfigService', () => {
    // configService.get이 SLACK_WEBHOOK_URL로 호출되었는지 확인
    expect(configService.get).toHaveBeenCalledWith('SLACK_WEBHOOK_URL');
  });

  it('should initialize webhookUrl with the value from ConfigService', () => {
    // private 변수에 접근하기 위해 any 타입으로 캐스팅
    const serviceAny = service as any;
    expect(serviceAny.webhookUrl).toBe(
      'https://hooks.slack.com/services/test/webhook',
    );
  });

  it('should log warning when SLACK_WEBHOOK_URL is not defined', async () => {
    // ConfigService.get이 undefined를 반환하도록 설정
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    // 서비스를 다시 초기화
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SlackWebhookService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    const newService = moduleRef.get<SlackWebhookService>(SlackWebhookService);

    // 경고 로그가 출력되었는지 확인
    expect(loggerSpy).toHaveBeenCalledWith(
      'SLACK_WEBHOOK_URL is not defined in the environment variables',
    );
  });

  it('should not send message when webhookUrl is not defined', async () => {
    // ConfigService.get이 undefined를 반환하도록 설정
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    // 서비스를 다시 초기화
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SlackWebhookService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    const newService = moduleRef.get<SlackWebhookService>(SlackWebhookService);

    // sendMessage 메서드 테스트
    const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');
    const result = await newService.sendMessage({ text: 'Test message' });

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Cannot send Slack message: SLACK_WEBHOOK_URL is not defined',
    );
    expect(result).toBe(false);
  });
});
