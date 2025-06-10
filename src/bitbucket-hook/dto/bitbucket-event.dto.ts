export interface BitbucketBaseEvent {
  eventKey: string;
  date: string;
  actor: {
    name: string;
    emailAddress: string;
    displayName: string;
  };
  repository: {
    slug: string;
    name: string;
    project: {
      key: string;
      name: string;
    };
  };
}

export interface PullRequestEvent extends BitbucketBaseEvent {
  pullRequest: {
    id: number;
    title: string;
    description: string;
    state: string;
    createdDate: string;
    updatedDate: string;
    links: {
      self: Array<{
        href: string;
      }>;
    };
    fromRef: {
      displayId: string;
    };
    toRef: {
      displayId: string;
      repository: {
        name: string;
      };
    };
    author: {
      user: {
        name: string;
        displayName: string;
        emailAddress: string;
      };
    };
    reviewers?: Array<{
      user: {
        name: string;
        displayName: string;
        emailAddress: string;
      };
      approved: boolean;
    }>;
    url: string;
  };
}

export interface PrCommentEvent extends BitbucketBaseEvent {
  comment: {
    id: number;
    text: string;
    author: {
      name: string;
      displayName: string;
      emailAddress: string;
    };
  };
  pullRequest: {
    id: number;
    title: string;
    url: string;
  };
}

export interface PrApprovalEvent extends PullRequestEvent {
  previousStatus: string;
  participant: {
    user: {
      name: string;
      displayName: string;
      emailAddress: string;
    };
    approved: boolean;
  };
}

export type BitbucketEvent =
  | PullRequestEvent
  | PrCommentEvent
  | PrApprovalEvent;
