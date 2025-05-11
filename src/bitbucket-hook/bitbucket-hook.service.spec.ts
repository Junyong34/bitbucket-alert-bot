import { Test, TestingModule } from '@nestjs/testing';
import { BitbucketHookService } from './bitbucket-hook.service';

describe('BitbucketHookService', () => {
  let service: BitbucketHookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BitbucketHookService],
    }).compile();

    service = module.get<BitbucketHookService>(BitbucketHookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
