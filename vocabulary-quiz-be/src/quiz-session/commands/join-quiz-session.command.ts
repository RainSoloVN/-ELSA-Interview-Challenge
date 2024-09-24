import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserDetailViewModel } from "src/user/user.view-model";
import { QuizSessionService } from "../quiz-session.service";
import { JoinQuizSessionDto, QuizSessionUserJoinedDto } from "../quiz-session.dto";
import { Inject } from "@nestjs/common";
import { ERabbitMQEvent, ERabbitMQName } from "src/utils/constants";
import { ClientProxy } from "@nestjs/microservices";

export class JoinQuizSessionCommand {
  constructor(
    public readonly currentUser: UserDetailViewModel,
    public readonly dto: JoinQuizSessionDto,
  ) {

  }
}

@CommandHandler(JoinQuizSessionCommand)
export class JoinQuizSessionHandler implements ICommandHandler<JoinQuizSessionCommand> {
  constructor(
    private readonly quizSessionService: QuizSessionService,
    @Inject(ERabbitMQName.API_SERVICE) private readonly apiServiceClient: ClientProxy,
  ) {

  }

  async execute(execution: JoinQuizSessionCommand) {
    const { dto, currentUser } = execution;

    if(!dto.quizSessionId) {
      throw new Error(`Please input quiz session to join.`);
    }
    
    const quizSessionSchema = await this.quizSessionService.join(currentUser, dto);
    
    const messageQueue = this.apiServiceClient.emit(ERabbitMQEvent.QUIZ_SESSION_USER_JOINED, {
      quizSessionId: quizSessionSchema._id.toHexString(),
      joinedUserId: currentUser._id,
      joinedUserFirstname: currentUser.firstname,
      joinedUserLastname: currentUser.lastname,
      quizSessionMembers: quizSessionSchema.users.map(a => ({
        userId: a.userId._id.toHexString(),
        isHost: a.isHost,
      })),
    } as QuizSessionUserJoinedDto);
    messageQueue.subscribe();

    return quizSessionSchema._id.toString();
  }
}