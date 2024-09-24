import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FragmentTokenAuthDto } from "../auth.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDetailViewModel } from "src/user/user.view-model";

export class FragmentTokenAuthQuery {
  constructor(
    public readonly query: FragmentTokenAuthDto,
  ) {

  }
}

@QueryHandler(FragmentTokenAuthQuery)
export class FragmentTokenAuthHandler implements IQueryHandler<FragmentTokenAuthQuery> {
  constructor(private jwtService: JwtService) {}
  
  async execute(execution: FragmentTokenAuthQuery): Promise<UserDetailViewModel> {
    const { query } = execution;

    const user = this.jwtService.verify<UserDetailViewModel>(query.token);
    
    return user;
  }
}