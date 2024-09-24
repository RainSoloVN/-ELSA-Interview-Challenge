import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { RegisterUserHandler } from './commands/register-user.command';
import { UsersProfile } from './user.profile';
import { LoginUserHandler } from './queries/login-user.query';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';

const CommandHanlders = [
  RegisterUserHandler,
];

const QueryHanlders = [
  LoginUserHandler,
];

@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    CqrsModule,
  ],
  providers: [
    UserService,
    UsersProfile,
    ...CommandHanlders,
    ...QueryHanlders,
  ]
})
export class UserModule {}
