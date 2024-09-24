import { ConfigService } from "@nestjs/config";

export const rabbitMQ = {
  connectionString: (configService: ConfigService): string => {
    const url = configService.get<string>('rabbit.url');
    const virtualHosts = configService.get<string>('rabbit.virtualHosts');
    const username = configService.get<string>('rabbit.username');
    const password = configService.get<string>('rabbit.password');

    let connection: string;
    if(username && password) {
      connection = `amqp://${username}:${password}@${url}`;
    } else {
      connection = `amqp://${url}`;
    }

    if(virtualHosts) {
      connection = `${connection}/${virtualHosts}`;
    }
    
    return connection;
  },
}