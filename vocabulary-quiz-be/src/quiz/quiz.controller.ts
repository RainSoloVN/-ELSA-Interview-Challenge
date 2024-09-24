import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ResponseData } from 'src/utils/common';
import { CreateQuizCommand } from './commands/create-quiz.command';
import { CreateQuizDto } from './quiz.dto';
import { ResultStatus } from 'src/utils/constants';

@UseGuards(AuthGuard)
@Controller('quiz')
@ApiTags('quiz')
@ApiBearerAuth('JWT-auth')
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {

  }

  @Post('create')
  async create(@Body() dto: CreateQuizDto): Promise<ResponseData<string>> {
    const quizSessionId = await this.commandBus.execute
      <CreateQuizCommand, string>(
        new CreateQuizCommand(dto)
      );

    return {
      result: ResultStatus.SUCCESS,
      data: quizSessionId,
    } as ResponseData<string>;
  }
}
