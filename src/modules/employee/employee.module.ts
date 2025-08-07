import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/entities/avatar.entity';
import { EmployeeStatus } from 'src/entities/employee-status.entity';
import { Employee } from 'src/entities/employee.entity';
import { MediaStatus } from 'src/entities/media-status.entity';
import { Role } from 'src/entities/role.entity';
import { Common } from 'src/entities/common.entity';
import { Media } from 'src/entities/media.entity';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FILESYSTEM_SERVICE } from 'src/assets/configs/app.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee, Role, EmployeeStatus, Avatar, 
      MediaStatus, Media, Common
    ]),
    ClientsModule.register([
      {
        name: FILESYSTEM_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    EmployeeService, 
    I18nService
  ],
})
export class EmployeeModule {}
