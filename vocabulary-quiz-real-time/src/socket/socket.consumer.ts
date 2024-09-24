
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Channel, ConsumeMessage } from 'amqplib';
import { ERabbitMQEvent, ERabbitMQName, ERabbitMQQueue } from 'src/utils/constants';
import { CommandBus } from '@nestjs/cqrs';
import { SendQuizSessionUserJoinedSocketDto } from './socket.dto';
import { SendQuizSessionUserJoinedCommand } from './commands/send-quiz-session-user-joined.command';

@Injectable()
export class SocketConsumer {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
    
  }

  @RabbitSubscribe({
    exchange: ERabbitMQName.API_SERVICE,
    routingKey: ERabbitMQQueue.QUIZ_SESSION_QUEUE,
    queue: ERabbitMQQueue.QUIZ_SESSION_QUEUE,
    queueOptions: {
      durable: true,
      arguments: {
        // 'x-queue-mode': 'lazy',
        'x-queue-type': 'quorum',
      },
      channel: ERabbitMQName.API_SERVICE,
    },
    createQueueIfNotExists: true,
    errorHandler: (channel: Channel, msg: ConsumeMessage, error: Error) => {
      console.log(error)
      channel.reject(msg, false)
    },
  })
  async onCreateRoomMultiConsumer(msg: any, amqpMsg: ConsumeMessage) {
    if(msg.pattern === ERabbitMQEvent.QUIZ_SESSION_USER_JOINED) {
      const data: SendQuizSessionUserJoinedSocketDto = msg.data;
      await this.commandBus.execute(new SendQuizSessionUserJoinedCommand(data));
    }
  }
}