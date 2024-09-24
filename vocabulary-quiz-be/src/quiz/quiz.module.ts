import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './quiz.schema';
import { QuizService } from './quiz.service';
import { CreateQuizHandler } from './commands/create-quiz.command';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

const CommandHandlers = [
  CreateQuizHandler,
]

@Module({
  controllers: [QuizController],
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            issuer: configService.get<string>('jwt.issuer'),
            audience: configService.get<string>('jwt.audience'),
            algorithm: "HS256",
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    QuizService,
    ...CommandHandlers,
  ]
})
export class QuizModule {}
