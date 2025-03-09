import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Création de l'application HTTP principale (Swagger inclus)
  const app = await NestFactory.create(AppModule);
  
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('PayeTonKawa API')
    .setDescription('API pour la gestion des commandes de café')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Création du microservice RabbitMQ en parallèle
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'order_retrieved',
      queueOptions: {
        durable: true,
      },
    },
  });

  microservice.listen();
  console.log('Microservice is listening for messages from RabbitMQ');

  // Lancer les deux applications
  await app.listen(process.env.PORT ?? 3000); // Lancement de l'application HTTP
}

bootstrap();
