import { HttpStatus, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FragmentTokenAuthDto } from 'src/auth/auth.dto';
import { FragmentTokenAuthQuery } from 'src/auth/queries/fragment-token-auth.query';
import { UserDetailViewModel } from 'src/user/user.view-model';
import { CreateDeviceDto } from 'src/device/device.dto';
import { CreateDeviceCommand } from 'src/device/commands/create-device.command';
import { DeleteDeviceCommand } from 'src/device/commands/delete-device.command';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ERabbitMQEvent } from 'src/utils/constants';

@WebSocketGateway({ cors: '*' })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(SocketGateway.name);
  
  constructor(
    private readonly socketService: SocketService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    
  }

  afterInit(server: any) {
    this.socketService.socket = server;
  }

  async handleConnection(client: Socket) {
    const authToken: any = client.handshake?.query?.token;

    try {
      const dto = new FragmentTokenAuthDto();
      dto.token = authToken;

      const user = await this.queryBus.execute<FragmentTokenAuthQuery, UserDetailViewModel>(new FragmentTokenAuthQuery(dto));

      const device: CreateDeviceDto = {
        userId: user._id,
        clientId: client.id,
      };

      await this.commandBus.execute(new CreateDeviceCommand(device));
    } catch (ex) {
      this.logger.log('Authentication', HttpStatus.NOT_FOUND);
      console.log(ex.message);
    }    
  }

  async handleDisconnect(client: Socket) {
    const authToken: any = client.handshake?.query?.token;

    try {
      const dto = new FragmentTokenAuthDto();
      dto.token = authToken; 
      
      const user = await this.queryBus.execute<FragmentTokenAuthQuery, UserDetailViewModel>(new FragmentTokenAuthQuery(dto));

      await this.commandBus.execute(new DeleteDeviceCommand({ 
        userId: user._id, 
        clientId: client.id 
      }));
      
      this.logger.log(client.id, 'Disconnect');
    } catch (ex) {
      this.logger.log('Not found', HttpStatus.NOT_FOUND);
      console.log(ex.message);
    }
  }
}