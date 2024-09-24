import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @AutoMap()
  _id?: Types.ObjectId;
  
  @Prop({ required: true })
  @AutoMap()
  name: string;
  
  @Prop()
  @AutoMap()
  questions: QuizQuestionSchema[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

// Sub Object
export class QuizQuestionSchema {
  @Prop({ required: true })
  content: string;

  @Prop()
  options: QuizQuestionOptionSchema[];
}

export class QuizQuestionOptionSchema {
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isTrue: boolean;

  @Prop()
  order: number;
}