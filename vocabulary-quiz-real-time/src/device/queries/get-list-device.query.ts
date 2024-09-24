import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DeleteDeviceDto, DeviceListFiler } from "../device.dto";
import { RedisStore } from "cache-manager-redis-store";
import { Inject } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ERedisStore } from "src/utils/constants";
import { DeviceListViewModel } from "../device.view-model";

export class GetListDeviceQuery {
  constructor(
    public readonly dto: DeviceListFiler,
  ) {

  }
}

@QueryHandler(GetListDeviceQuery)
export class GetListDeviceHandler implements IQueryHandler<GetListDeviceQuery> {
  private readonly redisStore: RedisStore;
  
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {
    this.redisStore = this.cache.store as unknown as RedisStore;
  }

  async execute(execution: GetListDeviceQuery): Promise<DeviceListViewModel[]> {
    const { dto } = execution;

    const client = this.redisStore.getClient();
    const keyStore = `${ERedisStore.SocketStore}:${dto.userId}`;
    const allFields = await client.HGETALL(keyStore);
    const parsedFields = Object.keys(allFields).map(field => ({
      clientId: field,
      data: JSON.parse(allFields[field]),
    } as DeviceListViewModel));

    return parsedFields;
  }
}