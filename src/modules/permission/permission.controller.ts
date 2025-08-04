import { Controller, Get, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Auth } from 'src/middlewares/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/middlewares/iam/authentication/enums/auth-type.enum';

@Auth(AuthType.Bearer)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  findAll(@Query() query:any) {
    return this.permissionService.findAll();
  }
}
