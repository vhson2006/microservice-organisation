import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: process.env.NATS_URL, // 👈
        queue: 'organisation-service', // 👈
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  app.setGlobalPrefix(config.get('api.prefix'));

  await app.listen(config.get('global.port'));
}
bootstrap();
