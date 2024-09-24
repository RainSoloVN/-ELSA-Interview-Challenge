import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizService } from "../quiz.service";
import { CreateQuizDto } from "../quiz.dto";

export class CreateQuizCommand {
  constructor(
    public readonly dto: CreateQuizDto,
  ) {

  }
}

@CommandHandler(CreateQuizCommand)
export class CreateQuizHandler implements ICommandHandler<CreateQuizCommand> {
  constructor(
    private readonly quizService: QuizService,
  ) {

  }

  async execute(execution: CreateQuizCommand) {
    const { dto } = execution;

    if(!dto.name) {
      throw new Error(`Please input quiz.`);
    }

    if(!dto.questions || !dto.questions.length) {
      throw new Error(`Please input questions.`);
    }
    
    const userSchema = await this.quizService.create(dto);
    return userSchema._id.toString();
  }
}