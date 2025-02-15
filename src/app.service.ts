import { Injectable } from '@nestjs/common';
// import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AppService {
  // private client: ClientProxy;

  constructor() {
    // this.client = ClientProxyFactory.create({
    //   transport: Transport.RMQ,
    //   options: {
    //     urls: ['amqp://localhost:5672'],
    //     queue: 'my_queue',
    //     queueOptions: {
    //       durable: false,
    //     },
    //   },
    // });
  }

  // sendMessage(data: any) {
  //   return this.client.send('my_queue', data);
  // }
}
