import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { Role } from 'src/entities/role.entity';
import { RoleQueryDto } from './dto/query-role.dto';
import { CORRECT } from 'src/assets/configs/app.constant';
import { EntityExistsPipe } from 'src/middlewares/globals/entity-exists.pipe';
import { Auth } from 'src/middlewares/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/middlewares/iam/authentication/enums/auth-type.enum';
import { Permissions } from 'src/middlewares/iam/authorization/decorators/permission.decoration';
import { CREATE, VIEW, UPDATE, DELETE } from 'src/assets/configs/app.permission';

@Auth(AuthType.Bearer)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permissions(`${CREATE.GROUP}.${CREATE.ROLE}`)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }
  
  @Permissions(`${VIEW.GROUP}.${VIEW.ROLE}`)
  @Get()
  async findAll(@Query() query: RoleQueryDto) {
    return await this.roleService.findAll(query);
  }

  @Permissions(`${VIEW.GROUP}.${VIEW.ROLE}`)
  @Get(':id')
  async findOne(@Param('id', EntityExistsPipe(Role)) role: Role) {
    return { 
      status: CORRECT, 
      data: role
    };
  }

  @Permissions(`${UPDATE.GROUP}.${UPDATE.ROLE}`)
  @Patch(':id')
  async update(
    @Param('id', EntityExistsPipe(Role)) role: Role, 
    @Payload() updateRoleDto: UpdateRoleDto
  ) {
    return await this.roleService.update(role, updateRoleDto);
  }

  @Permissions(`${DELETE.GROUP}.${DELETE.ROLE}`)
  @Delete(':id')
  async remove(@Param('id', EntityExistsPipe(Role)) role: Role) {
    return await this.roleService.remove(role);
  }
}
