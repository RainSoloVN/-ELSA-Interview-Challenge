import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateQuizSessionDto, JoinQuizSessionDto } from './quiz-session.dto';
import { ResponseData } from 'src/utils/common';
import { CreateQuizSessionCommand } from './commands/create-quiz-session.command';
import { ResultStatus } from 'src/utils/constants';
import { JoinQuizSessionCommand } from './commands/join-quiz-session.command';

@UseGuards(AuthGuard)
@Controller('quiz-session')
@ApiTags('quiz-session')
@ApiBearerAuth('JWT-auth')
export class QuizSessionController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {

  }

  @Post('create')
  async create(@Req() req: Request, @Body() dto: CreateQuizSessionDto): Promise<ResponseData<string>> {
    const currentUser = req['user'];
    
    const quizSessionId = await this.commandBus.execute
      <CreateQuizSessionCommand, string>(
        new CreateQuizSessionCommand(currentUser, dto)
      );

    return {
      result: ResultStatus.SUCCESS,
      data: quizSessionId,
    } as ResponseData<string>;
  }

  @Post('join')
  async join(@Req() req: Request, @Body() dto: JoinQuizSessionDto): Promise<ResponseData<string>> {
    const currentUser = req['user'];

    const quizSessionId = await this.commandBus.execute
      <JoinQuizSessionCommand, string>(
        new JoinQuizSessionCommand(currentUser, dto)
      );

    return {
      result: ResultStatus.SUCCESS,
      data: quizSessionId,
    } as ResponseData<string>;
  }
}
