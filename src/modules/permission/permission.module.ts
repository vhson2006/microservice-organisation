import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Permission } from 'src/entities/permission.entity';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Permission])],
  controllers: [PermissionController],
  providers: [PermissionService, I18nService],
})
export class PermissionModule {}
