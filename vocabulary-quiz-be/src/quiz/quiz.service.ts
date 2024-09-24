import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quiz.schema';
import { CreateQuizDto } from './quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizEntity: Model<QuizDocument>
  ) {

  }

  create = async (dto: CreateQuizDto): Promise<Quiz> => {
    const quizSchema = new Quiz();
    quizSchema.name = dto.name.trim();
    quizSchema.questions = dto.questions;

    return await this.quizEntity.create(quizSchema);
  }
}
