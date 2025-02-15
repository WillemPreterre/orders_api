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
      urls: ['amqp://localhost:5672'], // Remplace par ton broker si nécessaire
      queue: 'orders_retrieved',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Lancer les deux applications
  await microservice.listen(); // Lancement du microservice RabbitMQ
  await app.listen(process.env.PORT ?? 3000); // Lancement de l'application HTTP
}

bootstrap();
