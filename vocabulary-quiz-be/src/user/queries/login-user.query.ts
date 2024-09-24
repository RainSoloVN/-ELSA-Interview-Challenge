import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { LoginUserDto } from "../user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user.schema";
import { Model } from "mongoose";
import { bcryption } from "src/utils/bcryption";
import { UserDetailViewModel } from "../user.view-model";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export class LoginUserQuery {
  constructor(
    public readonly dto: LoginUserDto,
  ) {

  }
}

@QueryHandler(LoginUserQuery)
export class LoginUserHandler implements IQueryHandler<LoginUserQuery> {
  constructor(
    @InjectModel(User.name) private readonly userEntity: Model<UserDocument>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    
  }
  
  async execute(execution: LoginUserQuery): Promise<UserDetailViewModel> {
    const { dto } = execution;

    if(!dto.email) {
      throw new BadRequestException('Please input email.');
    }
    
    const userSchema = await this.userEntity.findOne({
      email: dto.email,
    });

    if(userSchema) {
      const isMatch = await bcryption.isMatch(dto.password, userSchema.password);

      if(isMatch) {
        const payload = await this.mapper.mapAsync(userSchema, User, UserDetailViewModel);

        return {
          ...payload,
          token: await this.jwtService.signAsync({ ...payload }, {
            secret: this.configService.get<string>('jwt.secret'),
            issuer: this.configService.get<string>('jwt.issuer'),
            audience: this.configService.get<string>('jwt.audience'),
            algorithm: "HS256",
          }),
        };
      }
    }

    throw new UnauthorizedException();
  }
}