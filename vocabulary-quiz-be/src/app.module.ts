import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuizModule } from './quiz/quiz.module';
import { QuizSessionModule } from './quiz-session/quiz-session.module';
import { UserModule } from './user/user.module';
import { AnswerModule } from './answer/answer.module';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'config/configuration';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ERabbitMQEvent, ERabbitMQName } from './utils/constants';
import { rabbitMQ } from './utils/rabbit-mq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongo'),
      }),
      inject: [ConfigService],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
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
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          exchanges: [{
            name: ERabbitMQName.API_SERVICE,
            type: 'fanout',
            createExchangeIfNotExists: true,
            options: {
              durable: true,
            }
          }],
          uri: rabbitMQ.connectionString(configService),
          connectionInitOptions: { wait: true },
          channels: {
            [ERabbitMQName.API_SERVICE]: {
              prefetchCount: 10,
              default: false,
            },
          },
        }
      },
      inject: [ConfigService],
    }),
    QuizModule,
    QuizSessionModule,
    UserModule,
    AnswerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
