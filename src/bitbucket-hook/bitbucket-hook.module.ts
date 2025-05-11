import { Module } from '@nestjs/common';
import { BitbucketHookService } from './bitbucket-hook.service';
import { BitbucketHookController } from './bitbucket-hook.controller';
import { SlackWebhookModule } from '../slack-webhook/slack-webhook.module';

@Module({
  imports: [SlackWebhookModule],
  controllers: [BitbucketHookController],
  providers: [BitbucketHookService],
})
export class BitbucketHookModule {}
