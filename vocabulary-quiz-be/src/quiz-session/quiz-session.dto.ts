
export class CreateQuizSessionDto {
  quizId: string;
}

export class JoinQuizSessionDto {
  quizSessionId: string;
}

export class QuizSessionUserJoinedDto {
  quizSessionId: string;
  joinedUserId: string;
  joinedUserFirstname: string;
  joinedUserLastname: string;
  quizSessionMembers: QuizSessionUserJoinedMemberDto[];
}

export class QuizSessionUserJoinedMemberDto {
  userId: string;
  isHost: boolean;
}