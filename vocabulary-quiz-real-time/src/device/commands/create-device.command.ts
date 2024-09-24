import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateDeviceDto } from "../device.dto";
import { RedisStore } from "cache-manager-redis-store";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { ERedisStore } from "src/utils/constants";

export class CreateDeviceCommand {
  constructor(
    public readonly dto: CreateDeviceDto,
  ) {

  }
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceHandler implements ICommandHandler<CreateDeviceCommand> {
  private readonly redisStore: RedisStore;
  
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {
    this.redisStore = this.cache.store as unknown as RedisStore;
  }

  async execute(execution: CreateDeviceCommand) {
    const { dto } = execution;

    const client = this.redisStore.getClient();
    const keyStore = `${ERedisStore.SocketStore}:${dto.userId}`;
    
    await client.HSET(keyStore, dto.clientId, JSON.stringify({
      deviceId: dto.clientId,
      connectedAt: new Date().toISOString(),
    }));
    await client.HEXPIRE(keyStore, dto.clientId, 86400);
    await client.EXPIRE(keyStore, 86400);
  }
}