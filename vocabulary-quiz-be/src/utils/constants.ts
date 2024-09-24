
export enum ResultStatus {
  SUCCESS = 20,
  ERROR = 90,
}

export enum ERabbitMQName {
  API_SERVICE = 'API_SERVICE',
  REAL_TIME_SERVICE = 'REAL_TIME_SERVICE',
}

export enum ERabbitMQQueue {
  ANSWER_QUEUE = 'ANSWER_QUEUE',
  QUIZ_SESSION_QUEUE = 'AQUIZ_SESSION_QUEUE',
}

export enum ERabbitMQEvent {
  QUIZ_SESSION_USER_JOINED = 'QUIZ_SESSION_USER_JOINED',
}