import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NOTIFICATION_SERVICE } from 'src/assets/configs/app.constant';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';
import { BcryptService } from 'src/middlewares/iam/hashing/bcrypt.service';
import { HashingService } from 'src/middlewares/iam/hashing/hashing.service';
import { Employee } from 'src/entities/employee.entity';
import { Role } from 'src/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Role]),
    ClientsModule.register([
      {
        name: NOTIFICATION_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
    I18nService
  ],
})
export class AuthenticationModule {}
