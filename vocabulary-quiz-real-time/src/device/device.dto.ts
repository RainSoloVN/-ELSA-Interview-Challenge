
export class CreateDeviceDto {
  userId: string;
  clientId: string;
}

export class DeleteDeviceDto {
  userId: string;
  clientId: string;
}

// Filter
export class DeviceListFiler {
  userId: string;
}