import { ApiHideProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;

  @ApiHideProperty()
  name?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}