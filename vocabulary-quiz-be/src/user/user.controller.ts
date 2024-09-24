import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './user.dto';
import { ResponseData } from 'src/utils/common';
import { UserDetailViewModel } from './user.view-model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginUserQuery } from './queries/login-user.query';
import { ResultStatus } from 'src/utils/constants';
import { RegisterUserCommand } from './commands/register-user.command';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {

  }

  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<ResponseData<UserDetailViewModel>> {
    const user = await this.queryBus.execute<LoginUserQuery, UserDetailViewModel>(new LoginUserQuery(dto));

    return {
      result: ResultStatus.SUCCESS,
      data: user,
    } as ResponseData<UserDetailViewModel>;
  }

  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<ResponseData<UserDetailViewModel>> {
    await this.commandBus.execute<RegisterUserCommand, string>(new RegisterUserCommand(dto));

    return {
      result: ResultStatus.SUCCESS,
    } as ResponseData<UserDetailViewModel>;
  }
}
