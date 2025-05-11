import { Body, Controller, Headers, Logger, Post } from '@nestjs/common';
import { BitbucketHookService } from './bitbucket-hook.service';
import { BitbucketEvent } from './dto/bitbucket-event.dto';

@Controller('bitbucket-hook')
export class BitbucketHookController {
  private readonly logger = new Logger(BitbucketHookController.name);

  constructor(private readonly bitbucketHookService: BitbucketHookService) {}

  /**
   * Bitbucket webhook 이벤트를 처리합니다.
   * @param payload webhook 이벤트 데이터
   * @param headers 요청 헤더
   * @returns 처리 결과
   */
  @Post('webhook')
  public async handleWebhook(
    @Body() payload: BitbucketEvent,
    @Headers('x-event-key') eventKey: string,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.debug(`Webhook 수신: ${eventKey}`);

    try {
      const result = await this.bitbucketHookService.processWebhook(
        eventKey,
        payload,
      );

      if (result) {
        return { success: true, message: `Webhook 처리 완료: ${eventKey}` };
      } else {
        return { success: false, message: `Webhook 처리 실패: ${eventKey}` };
      }
    } catch (error) {
      this.logger.error(`Webhook 처리 오류: ${error.message}`, error.stack);
      return { success: false, message: `Webhook 처리 오류: ${error.message}` };
    }
  }

  /**
   * Pull Request 생성 이벤트를 처리합니다.
   * @param payload 이벤트 데이터
   * @returns 처리 결과
   */
  @Post('pr/created')
  public async handlePrCreated(
    @Body() payload: BitbucketEvent,
  ): Promise<{ success: boolean }> {
    this.logger.debug('PR 생성 이벤트 수신');
    const result = await this.bitbucketHookService.processWebhook(
      'pr:opened',
      payload,
    );
    return { success: result };
  }

  /**
   * Pull Request 댓글 이벤트를 처리합니다.
   * @param payload 이벤트 데이터
   * @returns 처리 결과
   */
  @Post('pr/comment')
  public async handlePrComment(
    @Body() payload: BitbucketEvent,
  ): Promise<{ success: boolean }> {
    this.logger.debug('PR 댓글 이벤트 수신');
    const result = await this.bitbucketHookService.processWebhook(
      'pr:comment:added',
      payload,
    );
    return { success: result };
  }

  /**
   * Pull Request 승인 이벤트를 처리합니다.
   * @param payload 이벤트 데이터
   * @returns 처리 결과
   */
  @Post('pr/approved')
  public async handlePrApproved(
    @Body() payload: BitbucketEvent,
  ): Promise<{ success: boolean }> {
    this.logger.debug('PR 승인 이벤트 수신');
    const result = await this.bitbucketHookService.processWebhook(
      'pr:reviewer:approved',
      payload,
    );
    return { success: result };
  }

  /**
   * Pull Request 병합 이벤트를 처리합니다.
   * @param payload 이벤트 데이터
   * @returns 처리 결과
   */
  @Post('pr/merged')
  public async handlePrMerged(
    @Body() payload: BitbucketEvent,
  ): Promise<{ success: boolean }> {
    this.logger.debug('PR 병합 이벤트 수신');
    const result = await this.bitbucketHookService.processWebhook(
      'pr:merged',
      payload,
    );
    return { success: result };
  }

  /**
   * Pull Request 거부 이벤트를 처리합니다.
   * @param payload 이벤트 데이터
   * @returns 처리 결과
   */
  @Post('pr/declined')
  public async handlePrDeclined(
    @Body() payload: BitbucketEvent,
  ): Promise<{ success: boolean }> {
    this.logger.debug('PR 거부 이벤트 수신');
    const result = await this.bitbucketHookService.processWebhook(
      'pr:declined',
      payload,
    );
    return { success: result };
  }

  /**
   * Pull Request 삭제 이벤트를 처리합니다.
   * @param payload 이벤트 데이터
   * @returns 처리 결과
   */
  @Post('pr/deleted')
  public async handlePrDeleted(
    @Body() payload: BitbucketEvent,
  ): Promise<{ success: boolean }> {
    this.logger.debug('PR 삭제 이벤트 수신');
    const result = await this.bitbucketHookService.processWebhook(
      'pr:deleted',
      payload,
    );
    return { success: result };
  }
}
