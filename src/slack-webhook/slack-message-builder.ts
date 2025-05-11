import { SlackMessage } from './slack-webhook.service';

export class SlackMessageBuilder {
  private readonly blocks: Array<Record<string, any>> = [];
  private mainText?: string;

  /**
   * 메시지의 주요 텍스트를 설정합니다.
   * @param text 설정할 텍스트
   * @returns this 빌더 인스턴스
   */
  public setText(text: string): SlackMessageBuilder {
    this.mainText = text;
    return this;
  }

  /**
   * 섹션 블록을 추가합니다.
   * @param text 섹션에 표시할 텍스트
   * @returns this 빌더 인스턴스
   */
  public addSection(text: string): SlackMessageBuilder {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
    });
    return this;
  }

  /**
   * 제목 섹션을 추가합니다.
   * @param title 제목 텍스트
   * @returns this 빌더 인스턴스
   */
  public addHeader(title: string): SlackMessageBuilder {
    this.blocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: title,
        emoji: true,
      },
    });
    return this;
  }

  /**
   * 구분선을 추가합니다.
   * @returns this 빌더 인스턴스
   */
  public addDivider(): SlackMessageBuilder {
    this.blocks.push({
      type: 'divider',
    });
    return this;
  }

  /**
   * 컨텍스트 섹션을 추가합니다.
   * @param text 컨텍스트 텍스트
   * @returns this 빌더 인스턴스
   */
  public addContext(text: string): SlackMessageBuilder {
    this.blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text,
        },
      ],
    });
    return this;
  }

  /**
   * 버튼이 있는 액션 블록을 추가합니다.
   * @param text 버튼 텍스트
   * @param url 버튼 URL
   * @returns this 빌더 인스턴스
   */
  public addButton(text: string, url: string): SlackMessageBuilder {
    this.blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text,
            emoji: true,
          },
          url,
        },
      ],
    });
    return this;
  }

  /**
   * 빌더를 사용하여 SlackMessage 객체를 생성합니다.
   * @returns 생성된 SlackMessage 객체
   */
  public build(): SlackMessage {
    const message: SlackMessage = {};

    if (this.mainText) {
      message.text = this.mainText;
    }

    if (this.blocks.length > 0) {
      message.blocks = this.blocks;
    }

    return message;
  }
}
