import { Test, TestingModule } from '@nestjs/testing';
import { Orders } from './orders';

describe('Orders', () => {
  let provider: Orders;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Orders],
    }).compile();

    provider = module.get<Orders>(Orders);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
