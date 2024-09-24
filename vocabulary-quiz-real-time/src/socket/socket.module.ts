import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ERabbitMQName, ERabbitMQQueue } from 'src/utils/constants';
import { rabbitMQ } from 'src/utils/rabbit-mq';
import { SendQuizSessionUserJoinedHandler } from './commands/send-quiz-session-user-joined.command';
import { SocketConsumer } from './socket.consumer';

const CommandHandlers = [
  SendQuizSessionUserJoinedHandler,
]

@Module({
  imports: [
    CqrsModule,
  ],
  providers: [
    SocketService,
    SocketGateway,
    SocketConsumer,
    ...CommandHandlers,
  ]
})
export class SocketModule {}
