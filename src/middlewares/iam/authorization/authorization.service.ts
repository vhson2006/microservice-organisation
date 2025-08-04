import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
    private readonly i18nService: I18nService,
  ) {}

  async authorizeCheck(action: string, user: any) {
    try {
      const userData = await this.employeeRepository.findOne({ where: { id: user.sub } })
      return userData.role.permissions.map((p: any) => p.type).includes(action)
    } catch(e) {
      throw new BadRequestException(this.i18nService.translate('ERRORS.BAD_REQUEST'));
    }
  }
}