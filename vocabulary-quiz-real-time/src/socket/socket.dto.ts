
export class SendQuizSessionUserJoinedSocketDto {
  quizSessionId: string;
  joinedUserId: string;
  joinedUserFirstname: string;
  joinedUserLastname: string;
  quizSessionMembers: SendQuizSessionUserJoinedMemberSocketDto[];
}

export class SendQuizSessionUserJoinedMemberSocketDto {
  userId: string;
  isHost: boolean;
}