import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserDetailViewModel } from "src/user/user.view-model";
import { QuizSessionService } from "../quiz-session.service";
import { CreateQuizSessionDto } from "../quiz-session.dto";

export class CreateQuizSessionCommand {
  constructor(
    public readonly currentUser: UserDetailViewModel,
    public readonly dto: CreateQuizSessionDto,
  ) {

  }
}

@CommandHandler(CreateQuizSessionCommand)
export class CreateQuizSessionHandler implements ICommandHandler<CreateQuizSessionCommand> {
  constructor(
    private readonly quizSessionService: QuizSessionService,
  ) {

  }

  async execute(execution: CreateQuizSessionCommand) {
    const { dto, currentUser } = execution;

    if(!dto.quizId) {
      throw new Error(`Please input quiz to create.`);
    }
    
    const userSchema = await this.quizSessionService.create(currentUser, dto);
    
    return userSchema._id.toString();
  }
}