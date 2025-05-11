import { Injectable, Logger } from '@nestjs/common';
import { SlackWebhookService } from '../slack-webhook/slack-webhook.service';
import { SlackMessageBuilder } from '../slack-webhook/slack-message-builder';
import {
  BitbucketEvent,
  PrApprovalEvent,
  PrCommentEvent,
  PullRequestEvent,
} from './dto/bitbucket-event.dto';

@Injectable()
export class BitbucketHookService {
  private readonly logger = new Logger(BitbucketHookService.name);

  constructor(private readonly slackWebhookService: SlackWebhookService) {}

  /**
   * Bitbucket에서 PR이 생성되었을 때 처리합니다.
   * @param payload PR 생성 이벤트 데이터
   * @returns 처리 결과
   */
  public async handlePullRequestCreated(
    payload: PullRequestEvent,
  ): Promise<boolean> {
    this.logger.debug(`PR 생성 이벤트 처리: ${payload.pullRequest.id}`);

    const { pullRequest, repository, actor } = payload;
    const message = new SlackMessageBuilder()
      .setText(
        `${actor.displayName}님이 PR을 생성했습니다: ${pullRequest.title}`,
      )
      .addHeader('🔄 Pull Request 생성')
      .addSection(
        `*${pullRequest.title}*\n${pullRequest.description || '설명 없음'}`,
      )
      .addContext(`Repository: ${repository.project.key}/${repository.name}`)
      .addContext(
        `Branch: ${pullRequest.fromRef.displayId} → ${pullRequest.toRef.displayId}`,
      )
      .addButton('PR 보기', pullRequest.url)
      .build();

    return this.slackWebhookService.sendMessage(message);
  }

  /**
   * Bitbucket에서 PR에 댓글이 추가되었을 때 처리합니다.
   * @param payload PR 댓글 이벤트 데이터
   * @returns 처리 결과
   */
  public async handlePullRequestComment(
    payload: PrCommentEvent,
  ): Promise<boolean> {
    this.logger.debug(`PR 댓글 이벤트 처리: ${payload.pullRequest.id}`);

    const { comment, pullRequest, repository, actor } = payload;
    const message = new SlackMessageBuilder()
      .setText(
        `${actor.displayName}님이 PR에 댓글을 남겼습니다: ${pullRequest.title}`,
      )
      .addHeader('💬 Pull Request 댓글')
      .addSection(`*PR: ${pullRequest.title}*\n*댓글:*\n${comment.text}`)
      .addContext(`Repository: ${repository.project.key}/${repository.name}`)
      .addButton('PR 보기', pullRequest.url)
      .build();

    return this.slackWebhookService.sendMessage(message);
  }

  /**
   * Bitbucket에서 PR이 승인되었을 때 처리합니다.
   * @param payload PR 승인 이벤트 데이터
   * @returns 처리 결과
   */
  public async handlePullRequestApproved(
    payload: PrApprovalEvent,
  ): Promise<boolean> {
    this.logger.debug(`PR 승인 이벤트 처리: ${payload.pullRequest.id}`);

    const { pullRequest, repository, participant } = payload;
    const message = new SlackMessageBuilder()
      .setText(
        `${participant.user.displayName}님이 PR을 승인했습니다: ${pullRequest.title}`,
      )
      .addHeader('✅ Pull Request 승인')
      .addSection(`*${pullRequest.title}*`)
      .addContext(`Repository: ${repository.project.key}/${repository.name}`)
      .addContext(
        `Branch: ${pullRequest.fromRef.displayId} → ${pullRequest.toRef.displayId}`,
      )
      .addButton('PR 보기', pullRequest.url)
      .build();

    return this.slackWebhookService.sendMessage(message);
  }

  /**
   * Bitbucket에서 PR이 병합되었을 때 처리합니다.
   * @param payload PR 병합 이벤트 데이터
   * @returns 처리 결과
   */
  public async handlePullRequestMerged(
    payload: PullRequestEvent,
  ): Promise<boolean> {
    this.logger.debug(`PR 병합 이벤트 처리: ${payload.pullRequest.id}`);

    const { pullRequest, repository, actor } = payload;
    const message = new SlackMessageBuilder()
      .setText(
        `${actor.displayName}님이 PR을 병합했습니다: ${pullRequest.title}`,
      )
      .addHeader('🎉 Pull Request 병합')
      .addSection(`*${pullRequest.title}*`)
      .addContext(`Repository: ${repository.project.key}/${repository.name}`)
      .addContext(
        `Branch: ${pullRequest.fromRef.displayId} → ${pullRequest.toRef.displayId}`,
      )
      .addButton('PR 보기', pullRequest.url)
      .build();

    return this.slackWebhookService.sendMessage(message);
  }

  /**
   * Bitbucket에서 PR이 거부되었을 때 처리합니다.
   * @param payload PR 거부 이벤트 데이터
   * @returns 처리 결과
   */
  public async handlePullRequestDeclined(
    payload: PullRequestEvent,
  ): Promise<boolean> {
    this.logger.debug(`PR 거부 이벤트 처리: ${payload.pullRequest.id}`);

    const { pullRequest, repository, actor } = payload;
    const message = new SlackMessageBuilder()
      .setText(
        `${actor.displayName}님이 PR을 거부했습니다: ${pullRequest.title}`,
      )
      .addHeader('❌ Pull Request 거부')
      .addSection(`*${pullRequest.title}*`)
      .addContext(`Repository: ${repository.project.key}/${repository.name}`)
      .addContext(
        `Branch: ${pullRequest.fromRef.displayId} → ${pullRequest.toRef.displayId}`,
      )
      .addButton('PR 보기', pullRequest.url)
      .build();

    return this.slackWebhookService.sendMessage(message);
  }

  /**
   * Bitbucket에서 PR이 삭제되었을 때 처리합니다.
   * @param payload PR 삭제 이벤트 데이터
   * @returns 처리 결과
   */
  public async handlePullRequestDeleted(
    payload: PullRequestEvent,
  ): Promise<boolean> {
    this.logger.debug(`PR 삭제 이벤트 처리: ${payload.pullRequest.id}`);

    const { pullRequest, repository, actor } = payload;
    const message = new SlackMessageBuilder()
      .setText(
        `${actor.displayName}님이 PR을 삭제했습니다: ${pullRequest.title}`,
      )
      .addHeader('🗑️ Pull Request 삭제')
      .addSection(`*${pullRequest.title}*`)
      .addContext(`Repository: ${repository.project.key}/${repository.name}`)
      .addContext(
        `Branch: ${pullRequest.fromRef.displayId} → ${pullRequest.toRef.displayId}`,
      )
      .build();

    return this.slackWebhookService.sendMessage(message);
  }

  /**
   * 이벤트 타입에 따라 적절한 처리 함수를 호출합니다.
   * @param eventKey 이벤트 키
   * @param payload 이벤트 데이터
   * @returns 처리 결과
   */
  public async processWebhook(
    eventKey: string,
    payload: BitbucketEvent,
  ): Promise<boolean> {
    this.logger.debug(`이벤트 처리: ${eventKey}`);

    switch (eventKey) {
      case 'pr:opened':
        return this.handlePullRequestCreated(payload as PullRequestEvent);
      case 'pr:comment:added':
        return this.handlePullRequestComment(payload as PrCommentEvent);
      case 'pr:reviewer:approved':
        return this.handlePullRequestApproved(payload as PrApprovalEvent);
      case 'pr:merged':
        return this.handlePullRequestMerged(payload as PullRequestEvent);
      case 'pr:declined':
        return this.handlePullRequestDeclined(payload as PullRequestEvent);
      case 'pr:deleted':
        return this.handlePullRequestDeleted(payload as PullRequestEvent);
      default:
        this.logger.warn(`지원하지 않는 이벤트 타입: ${eventKey}`);
        return false;
    }
  }
}
