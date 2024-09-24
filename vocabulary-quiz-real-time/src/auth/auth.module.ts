import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { FragmentTokenAuthHandler } from './queries/fragment-token-auth.query';
import { ConfigModule, ConfigService } from '@nestjs/config';

const QueryHandlers = [
  FragmentTokenAuthHandler,
]

@Module({
  imports: [
    CqrsModule,
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
  providers: [
    ...QueryHandlers,
  ]
})
export class AuthModule {

}
