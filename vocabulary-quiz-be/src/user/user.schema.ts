import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @AutoMap()
  _id?: Types.ObjectId;
  
  @Prop({ required: true })
  @AutoMap()
  firstname: string;
  
  @Prop()
  @AutoMap()
  lastname: string;

  @Prop({ required: true })
  @AutoMap()
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);