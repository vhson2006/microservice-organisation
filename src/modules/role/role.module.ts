import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Permission } from 'src/entities/permission.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { Role } from 'src/entities/role.entity';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, RolePermission, Employee]),
  ],
  controllers: [RoleController],
  providers: [RoleService, I18nService],
})
export class RoleModule {}
