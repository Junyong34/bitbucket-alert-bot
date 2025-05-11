import { Test, TestingModule } from '@nestjs/testing';
import { BitbucketHookController } from './bitbucket-hook.controller';
import { BitbucketHookService } from './bitbucket-hook.service';

describe('BitbucketHookController', () => {
  let controller: BitbucketHookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BitbucketHookController],
      providers: [BitbucketHookService],
    }).compile();

    controller = module.get<BitbucketHookController>(BitbucketHookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
