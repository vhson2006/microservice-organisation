import { BadRequestException, Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { CORRECT, INCORRECT } from 'src/assets/configs/app.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private readonly i18nService: I18nService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async findAll() {
    try {
      const response = await this.permissionRepository.findAndCount({});
      return {
        status: CORRECT,
        data: response[0],
        total: response[1]
      }
    } catch (e) {
      this.logger.error(`${JSON.stringify(e)}`);
      return {
        status: INCORRECT,
        message: this.i18nService.translate('ERRORS.BAD_REQUEST')
      }
    }
  }
}
