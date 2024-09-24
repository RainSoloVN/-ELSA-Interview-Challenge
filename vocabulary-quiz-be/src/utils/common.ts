import { ResultStatus } from "./constants";

export class ResponseData<T> {
  result: ResultStatus;
  message: string;
  errors: { [key: string]: string };
  data: T;
}