import { Module } from '@nestjs/common';
import { QuizSessionController } from './quiz-session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ERabbitMQName, ERabbitMQQueue } from 'src/utils/constants';
import { rabbitMQ } from 'src/utils/rabbit-mq';
import { QuizSession, QuizSessionSchema } from './quiz-session.schema';
import { QuizSessionService } from './quiz-session.service';
import { CreateQuizSessionHandler } from './commands/create-quiz-session.command';
import { JoinQuizSessionHandler } from './commands/join-quiz-session.command';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';

const CommandHandlers = [
  CreateQuizSessionHandler,
  JoinQuizSessionHandler,
]

@Module({
  controllers: [QuizSessionController],
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: ERabbitMQName.API_SERVICE,
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMQ.connectionString(configService)],
              queue: ERabbitMQQueue.QUIZ_SESSION_QUEUE,
              queueOptions: {
                durable: true,
                arguments: {
                  // 'x-queue-mode': 'lazy',
                  'x-queue-type': 'quorum',
                }
              }
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    MongooseModule.forFeature([{ name: QuizSession.name, schema: QuizSessionSchema }]),
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
    QuizSessionService,
    ...CommandHandlers,
  ]
})
export class QuizSessionModule {}
