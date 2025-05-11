import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { BitbucketHookModule } from './bitbucket-hook/bitbucket-hook.module';
import { SlackWebhookModule } from './slack-webhook/slack-webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    BitbucketHookModule,
    SlackWebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
