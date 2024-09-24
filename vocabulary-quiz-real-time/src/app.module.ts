import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DeviceModule } from './device/device.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import configuration from 'config/configuration';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ERabbitMQName } from './utils/constants';
import { rabbitMQ } from './utils/rabbit-mq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
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
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: await redisStore({
            socket: {
              host: configService.get<string>('redis.host'),
              port: configService.get<number>('redis.port'),
            },
            username: configService.get<string>('redis.username'),
            password: configService.get<string>('redis.password'),
            database: 0,
          }) as unknown as CacheStore,
          ttl: 60480000, // 1 week
        }
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          exchanges: [{
            name: ERabbitMQName.API_SERVICE,
            type: 'fanout',
            createExchangeIfNotExists: true,
            options: {
              durable: true,
            }
          }],
          uri: rabbitMQ.connectionString(configService),
          connectionInitOptions: { wait: true },
          channels: {
            [ERabbitMQName.API_SERVICE]: {
              prefetchCount: 10,
              default: false,
            },
          },
        }
      },
      inject: [ConfigService],
    }),
    SocketModule, 
    AuthModule, 
    UserModule, 
    DeviceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
