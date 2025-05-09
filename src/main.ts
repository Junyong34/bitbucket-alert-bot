import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3080;
  await app.listen(port);

  const logger = new Logger('NestApplication ! ');
  const baseUrl = await app.getUrl();

  logger.log(`서버가 ${port} 포트에서 실행 중입니다.`);
  logger.log(`HTTP 서버 주소: ${baseUrl}`);
}
bootstrap();
