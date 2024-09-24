import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './user.dto';
import { bcryption } from 'src/utils/bcryption';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userEntity: Model<UserDocument>
  ) {

  }

  register = async (dto: RegisterUserDto) => {
    const item: User = {
      firstname: dto.firstname.trim(),
      lastname: dto.lastname?.trim(),
      email: dto.email.trim(),
      password: dto.password.trim(),
    };

    if(dto.password) {
      item.password = await bcryption.encrypte(dto.password);
    }

    return this.userEntity.create(item);
  }
}
