import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop()
  @AutoMap()
  _id?: Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @AutoMap()
  userId: User;

  @Prop()
  score: number;

  @Prop()
  answers: AnswerQuestionSchema[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

// Sub Object
export class AnswerQuestionSchema {
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isTrue: boolean;

  @Prop({ default: false })
  isChoice: boolean;

  @Prop()
  order: number;
}