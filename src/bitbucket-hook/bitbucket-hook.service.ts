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
    const prAuthor = pullRequest.author.user.displayName;
    const prUserId = pullRequest.author.user.name;
    const prEmail = pullRequest.author.user.emailAddress;
    const prID = pullRequest.id;
    const prTitle = pullRequest.title;
    const prDescription = pullRequest.description;
    const prFromBr = pullRequest.fromRef.displayId;
    const prToBr = pullRequest.toRef.displayId;
    const prReviewers = (pullRequest.reviewers || [])
      .map((r) => r.user.displayName)
      .join(', ');
    const prUrl = pullRequest.url;
    const approvedBy = participant.user.displayName;
    const approvedById = participant.user.name;
    const approvedByEmail = participant.user.emailAddress;
    const isPrd = prToBr === 'master';
    const isQa = prToBr === 'release/release';

    const message = {
      text: `✅ PR이 승인되었습니다: ${prTitle}`,
      attachments: [
        {
          mrkdwn_in: ['text'],
          color: '#36a64f',
          title: `Pull request <${prUrl}|#${prID}> | (APPROVED)`,
          pretext: `: ${prUrl} `,
          author_name: `by ${prUserId} / ${prAuthor}`,
          author_email: `${prEmail}`,
          author_icon:
            'https://cdn1.iconfinder.com/data/icons/logos-1/24/developer-community-github-1024.png',
          fields: [
            {
              value: `*승인자:* <@${approvedById}> ${approvedBy}`,
              short: false,
            },
            {
              value: `*브랜치:* \`${prFromBr}\`  →  \`${prToBr}\``,
              short: false,
            },
            {
              value: `*제목:* ${prTitle}`,
              short: false,
            },
            {
              title: 'Description',
              value: prDescription || '설명 없음',
              short: false,
            },
            {
              title: 'Reviewers',
              value: prReviewers ? prReviewers : '없음',
              short: false,
            },
          ],
          thumb_url:
            'https://cdn.icon-icons.com/icons2/2108/PNG/512/bitbucket_icon_130979.png',
          footer: 'bitbucket',
          footer_icon:
            'https://cdn.icon-icons.com/icons2/2108/PNG/512/bitbucket_icon_130979.png',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };

    // attachments 기반 메시지는 SlackMessageBuilder로 지원하지 않으므로, 직접 전송
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
    const prAuthor = pullRequest.author.user.displayName;
    const prUserId = pullRequest.author.user.name;
    const prEmail = pullRequest.author.user.emailAddress;
    const prID = pullRequest.id;
    const prTitle = pullRequest.title;
    const prDescription = pullRequest.description;
    const prFromBr = pullRequest.fromRef.displayId;
    const prToBr = pullRequest.toRef.displayId;
    const repoName = pullRequest.toRef.repository.name;
    const prReviewers = (pullRequest.reviewers || [])
      .map((r) => r.user.displayName)
      .join(', ');
    const prUrl = pullRequest.url;
    const isPrd = prToBr === 'master';
    const isQa = prToBr === 'release/release';

    // 리뷰어가 없으면 패스
    if (prReviewers.length === 0) {
      return new Promise<boolean>((resolve) => {
        resolve(false);
      });
    }
    const base = 'https://homeplus.atlassian.net/browse';
    const re = /(\b[A-Z][A-Z0-9_]+-[1-9][0-9]*)/g; // https://stackoverflow.com/a/73914895
    // Slack로 보낼 JSON 데이터 생성
    const slackMessage = {
      text: '✅ merge 되었습니다.',
      attachments: [
        {
          mrkdwn_in: ['text'],
          color: '#36a64f',
          title: `Pull request <${prUrl}|#${prID}> | (MERGED) (${repoName} ☑️)`,
          // "title_link": "https://api.slack.com/",
          // "pretext": `(${repoName} ☑️)`,
          author_name: `by ${prUserId} / ${prAuthor}`,
          author_email: `${prEmail}`,
          // "author_link": "https://bitbucket.homeplusnet.co.kr/",
          author_icon:
            'https://cdn1.iconfinder.com/data/icons/logos-1/24/developer-community-github-1024.png',
          fields: [
            {
              value: `\`${prFromBr}\`  →  \`${prToBr}\``,
              type: 'code',
              short: false,
            },
            {
              title: 'Title',
              value: `${prTitle.replaceAll(re, `<${base}/$1|$1>`)} `,
              short: false,
            },
          ],
          thumb_url:
            'https://cdn.icon-icons.com/icons2/2108/PNG/512/bitbucket_icon_130979.png',
          footer: 'bitbucket',
          footer_icon:
            'https://cdn.icon-icons.com/icons2/2108/PNG/512/bitbucket_icon_130979.png',
          ts: Math.floor(new Date().getTime() / 1000),
        },
      ],
    };

    return this.slackWebhookService.sendMessage(slackMessage);
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

    // PR 정보 추출
    const prAuthor = actor.displayName;
    const prUserId = actor.name;
    const prEmail = actor.emailAddress;
    const prID = pullRequest.id;
    const prTitle = pullRequest.title;
    const prDescription = pullRequest.description;
    const prFromBr = pullRequest.fromRef.displayId;
    const prToBr = pullRequest.toRef.displayId;
    const prReviewers = pullRequest.reviewers;
    const repoName = pullRequest.toRef.repository.name;
    // console.log('⭐️ payload.pullRequest.toRef.repository =>', payload.pullRequest.toRef.repository)
    const reviewerNameList = prReviewers?.map((d) => {
      return `<@${d.user.name}>`;
    });
    const prUrl = pullRequest.links.self[0].href;

    // prd 인경우 강조 표시 값 ture/false
    const isPrd = prToBr === 'master';
    const isQa = prToBr === 'release/release';

    // 리뷰어가 없으면 패스
    if (prReviewers?.length === 0) {
      return new Promise<boolean>((resolve) => {
        resolve(false);
      });
    }
    // title WIP 인경우 패스
    if (prTitle.toUpperCase().includes('WIP')) {
      return new Promise<boolean>((resolve) => {
        resolve(false);
      });
    }
    const base = 'https://homeplus.atlassian.net/browse';
    const re = /(\b[A-Z][A-Z0-9_]+-[1-9][0-9]*)/g; // https://stackoverflow.com/a/73914895

    const slackMessage = {
      text: `🚀 새로운 PR이 Open 되었습니다.${isPrd ? '[PRD]' : ''} ${isQa ? '[QA]' : ''}`,
      attachments: [
        {
          mrkdwn_in: ['text'],
          color: '#4f5aec',
          title: `Pull request <${prUrl}|#${prID}>  | (OPEN) ${isPrd ? '🚨' : ''}`,
          // "title_link": "https://api.slack.com/",
          pretext: `URL: ${prUrl} (${repoName} ☑️)`,
          author_name: `by ${prUserId} / ${prAuthor}  `,
          author_email: `${prEmail}`,
          // "author_link": "https://bitbucket.homeplusnet.co.kr/",
          author_icon:
            'https://cdn1.iconfinder.com/data/icons/logos-1/24/developer-community-github-1024.png',
          fields: [
            {
              value: `\`${prFromBr}\`  →  \`${prToBr}\``,
              type: 'mrkdwn',
              short: false,
            },
            {
              value: ``,
              short: false,
            },
            {
              value: `${prTitle.replaceAll(re, `<${base}/$1|$1>`)} `,
              short: false,
            },
            {
              title: 'Description',
              value: `${prDescription || ''}`,
              short: false,
            },
            {
              title: 'Reviewers',
              // "value": `<!here> ➡  <@${prUserId}> ${reviewerNameList.join(',')}`,
              value: `<@${prUserId}> 👋  ${reviewerNameList?.join(',')}`,
              type: 'code',
              short: false,
            },
          ],
          thumb_url:
            'https://cdn.icon-icons.com/icons2/2108/PNG/512/bitbucket_icon_130979.png',
          footer: 'bitbucket',
          footer_icon:
            'https://cdn.icon-icons.com/icons2/2108/PNG/512/bitbucket_icon_130979.png',
          ts: Math.floor(new Date().getTime() / 1000),
        },
      ],
    };

    return this.slackWebhookService.sendMessage(slackMessage);
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
