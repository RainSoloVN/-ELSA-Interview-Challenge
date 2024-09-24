import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Answer } from 'src/answer/answer.schema';
import { Quiz } from 'src/quiz/quiz.schema';
import { User } from 'src/user/user.schema';

export type QuizSessionDocument = HydratedDocument<QuizSession>;

@Schema()
export class QuizSession {
  @AutoMap()
  _id?: Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' })
  @AutoMap()
  quizId: Quiz;

  @Prop()
  users?: QuizSessionUserSchema[];
}

export const QuizSessionSchema = SchemaFactory.createForClass(QuizSession);

// Sub Object
export class QuizSessionUserSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' })
  answerId?: Answer;

  @Prop({ default: false })
  isHost?: boolean;
}