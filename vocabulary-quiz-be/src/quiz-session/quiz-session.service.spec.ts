import { Test, TestingModule } from '@nestjs/testing';
import { QuizSessionService } from './quiz-session.service';

describe('QuizSessionService', () => {
  let service: QuizSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizSessionService],
    }).compile();

    service = module.get<QuizSessionService>(QuizSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
