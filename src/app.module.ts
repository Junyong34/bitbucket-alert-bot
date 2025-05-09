import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { BitbucketHookModule } from './bitbucket-hook/bitbucket-hook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    BitbucketHookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
