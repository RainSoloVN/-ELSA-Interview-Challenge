import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteDeviceDto } from "../device.dto";
import { RedisStore } from "cache-manager-redis-store";
import { Inject } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ERedisStore } from "src/utils/constants";

export class DeleteDeviceCommand {
  constructor(
    public readonly dto: DeleteDeviceDto,
  ) {

  }
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceHandler implements ICommandHandler<DeleteDeviceCommand> {
  private readonly redisStore: RedisStore;
  
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {
    this.redisStore = this.cache.store as unknown as RedisStore;
  }

  async execute(execution: DeleteDeviceCommand) {
    const { dto } = execution;

    const client = this.redisStore.getClient();
    const keyStore = `${ERedisStore.SocketStore}:${dto.userId}`;
    await client.HDEL(keyStore, dto.clientId);
  }
}