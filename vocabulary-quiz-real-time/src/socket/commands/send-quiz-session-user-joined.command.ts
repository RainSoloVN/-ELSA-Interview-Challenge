import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { SendQuizSessionUserJoinedSocketDto } from "../socket.dto";
import { SocketService } from "../socket.service";
import { GetListDeviceQuery } from "src/device/queries/get-list-device.query";
import { DeviceListViewModel } from "src/device/device.view-model";
import { ESocketEvent } from "../socket.constants";

export class SendQuizSessionUserJoinedCommand {
  constructor(
    public readonly dto: SendQuizSessionUserJoinedSocketDto,
  ) {

  }
}

@CommandHandler(SendQuizSessionUserJoinedCommand)
export class SendQuizSessionUserJoinedHandler implements ICommandHandler<SendQuizSessionUserJoinedCommand> {
  constructor(
    private readonly socketService: SocketService,
    private readonly queryBus: QueryBus,
  ) {

  }

  async execute(execution: SendQuizSessionUserJoinedCommand) {
    const { dto } = execution;

    if(dto && dto.quizSessionMembers && dto.quizSessionMembers.length) {
      for(const item of dto.quizSessionMembers) {
        if(item.userId !== dto.joinedUserId) {
          const devices = await this.queryBus.execute
            <GetListDeviceQuery, DeviceListViewModel[]>(new GetListDeviceQuery({
              userId: item.userId,
            })
          );

          devices?.forEach((item: DeviceListViewModel) => {
            this.socketService.socket.sockets.to(item.clientId).emit(
              ESocketEvent.UserJoinQuizSession, dto
            );
          });
        }
      }
    }
  }
}