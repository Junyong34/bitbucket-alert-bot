import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';

export interface SlackMessage {
  text?: string;
  blocks?: Array<Record<string, any>>;
}

@Injectable()
export class SlackWebhookService {
  private readonly logger = new Logger(SlackWebhookService.name);
  private readonly webhookUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.webhookUrl = this.configService.get<string>('SLACK_WEBHOOK_URL')!;
    if (!this.webhookUrl) {
      this.logger.warn(
        'SLACK_WEBHOOK_URL is not defined in the environment variables',
      );
    }
  }

  /**
   * 슬랙 webhook으로 메시지를 전송합니다.
   * @param message 전송할 메시지 정보
   * @returns 전송 성공 여부
   */
  public async sendMessage(message: SlackMessage): Promise<boolean> {
    if (!this.webhookUrl) {
      this.logger.error(
        'Cannot send Slack message: SLACK_WEBHOOK_URL is not defined',
      );
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const data = JSON.stringify(message);

      const request = https.request(
        this.webhookUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
          },
        },
        (response) => {
          if (response.statusCode === 200) {
            this.logger.debug('Slack message sent successfully');
            resolve(true);
          } else {
            this.logger.error(
              `Failed to send Slack message: ${response.statusCode}`,
            );
            resolve(false);
          }
        },
      );

      request.on('error', (error) => {
        this.logger.error(`Error sending Slack message: ${error.message}`);
        resolve(false);
      });

      request.write(data);
      request.end();
    });
  }
}
