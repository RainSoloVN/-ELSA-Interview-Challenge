
export class CreateQuizDto {
  name: string;
  questions: CreateQuizQuestionDto[];
}

export class CreateQuizQuestionDto {
  content: string;
  options: CreateQuizQuestionOptionDto[];
}

export class CreateQuizQuestionOptionDto {
  content: string;
  isTrue: boolean;
  order: number;
}