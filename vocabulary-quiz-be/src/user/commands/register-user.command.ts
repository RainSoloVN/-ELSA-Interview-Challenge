import { RegisterUserDto } from "../user.dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserService } from "../user.service";

export class RegisterUserCommand {
  constructor(
    public readonly dto: RegisterUserDto,
  ) {

  }
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userService: UserService,
  ) {

  }

  async execute(execution: RegisterUserCommand) {
    const { dto } = execution;

    if(!dto.password) {
      throw new Error(`Please input your passord.`);
    }
    
    const userSchema = await this.userService.register(dto);
    
    return userSchema._id.toString();
  }
}