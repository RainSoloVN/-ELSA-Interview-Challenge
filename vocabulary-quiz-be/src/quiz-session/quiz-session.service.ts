import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuizSession, QuizSessionDocument } from './quiz-session.schema';
import { CreateQuizSessionDto, JoinQuizSessionDto } from './quiz-session.dto';
import { UserDetailViewModel } from 'src/user/user.view-model';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Quiz } from 'src/quiz/quiz.schema';

@Injectable()
export class QuizSessionService {
  constructor(
    @InjectModel(QuizSession.name) private readonly quizSessionEntity: Model<QuizSessionDocument>
  ) {

  }

  create = async (currentUser: UserDetailViewModel, dto: CreateQuizSessionDto): Promise<QuizSession> => {
    const quizSessionSchema = new QuizSession();
    quizSessionSchema.quizId = { _id: new Types.ObjectId(dto.quizId) } as Quiz;

    quizSessionSchema.users = [{
      userId: { _id: new Types.ObjectId(currentUser._id) } as User,
      isHost: true,
    }];

    return await this.quizSessionEntity.create(quizSessionSchema);
  }

  join = async (currentUser: UserDetailViewModel, dto: JoinQuizSessionDto): Promise<QuizSession> => {
    const quizSessionSchema: QuizSession = await this.quizSessionEntity.findOne({ 
      _id: new Types.ObjectId(dto.quizSessionId) 
    }).lean().exec();

    if(!quizSessionSchema) {
      throw new BadRequestException('Quiz session is not existed');
    }

    if(!quizSessionSchema.users) {
      quizSessionSchema.users = [];
    }

    const existed = quizSessionSchema.users.find(a => a.userId._id.toHexString() === currentUser._id);
    if(!existed) {
      quizSessionSchema.users.push({
        userId: { _id: new Types.ObjectId(currentUser._id) } as User,
      });
  
      return await this.quizSessionEntity.findByIdAndUpdate(quizSessionSchema._id, quizSessionSchema, {
        new: true,
        returnDocument: 'after',
      }).lean().exec();
    }
    
    return quizSessionSchema;
  }
}
