import { Injectable } from "@nestjs/common";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { UserDetailViewModel } from "./user.view-model";
import { User } from "./user.schema";

@Injectable()
export class UsersProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, User, UserDetailViewModel,
        forMember((destination: UserDetailViewModel) => destination._id,
          mapFrom((source: User) => {
            return source._id.toHexString();
          })
        ));
    };
  }
}