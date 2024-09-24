import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            issuer: configService.get<string>('jwt.issuer'),
            audience: configService.get<string>('jwt.audience'),
            algorithm: "HS256",
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
