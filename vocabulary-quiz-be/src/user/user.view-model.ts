import { AutoMap } from "@automapper/classes";

export class UserDetailViewModel {
  @AutoMap()
  _id: string;

  @AutoMap()
  firstname: string;

  @AutoMap()
  lastname?: string;

  @AutoMap()
  email: string;

  token?: string;
}