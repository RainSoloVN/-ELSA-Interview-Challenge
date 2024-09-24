import { Module } from '@nestjs/common';
import { CreateDeviceHandler } from './commands/create-device.command';
import { DeleteDeviceHandler } from './commands/delete-device.command';
import { GetListDeviceHandler } from './queries/get-list-device.query';

const CommandHandlers = [
  CreateDeviceHandler,
  DeleteDeviceHandler,
]

const QueryHandlers = [
  GetListDeviceHandler,
]

@Module({
  imports: [],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
  ]
})
export class DeviceModule {}
