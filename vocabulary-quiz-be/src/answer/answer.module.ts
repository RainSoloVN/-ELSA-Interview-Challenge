import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ERabbitMQName, ERabbitMQQueue } from 'src/utils/constants';
import { rabbitMQ } from 'src/utils/rabbit-mq';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './answer.schema';

@Module({
  controllers: [AnswerController],
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: ERabbitMQName.API_SERVICE,
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMQ.connectionString(configService)],
              queue: ERabbitMQQueue.ANSWER_QUEUE,
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
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ]
})
export class AnswerModule {}
