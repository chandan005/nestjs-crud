import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI || ''],
          queue: 'users_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
