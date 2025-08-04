import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { EMPLOYEE_STATUS } from 'src/assets/configs/app.common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NOTIFICATION_SERVICE, CORRECT, INCORRECT } from 'src/assets/configs/app.constant';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dto/sign-in.dto';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';
import { HashingService } from 'src/middlewares/iam/hashing/hashing.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly i18nService: I18nService,
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @Inject(NOTIFICATION_SERVICE) private readonly natsMessageBroker: ClientProxy,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      const employee = await this.employeeRepository.findOne({
      relations: { status: true },
      where: {
        status: { type: EMPLOYEE_STATUS.ACTIVED },
        email: signInDto.email,
      }
    });
      if (!employee) {
        return {
          status: INCORRECT,
          message: this.i18nService.translate('ERRORS.USER_NOT_FOUND')
        }
      }
      const isEqual = await this.hashingService.compare(
        signInDto.password,
        employee.password,
      );
      if (!isEqual) {
        return {
          status: INCORRECT,
          message: this.i18nService.translate('ERRORS.PASSWORD_INCORRECT')
        }
      }
      return {
        status: CORRECT,
        data: employee
      }
    } catch(e) {
      this.logger.error(`${JSON.stringify(e)}`);
      return {
        status: INCORRECT,
        message: this.i18nService.translate('ERRORS.BAD_REQUEST')
      }
    }
  }

  async refreshTokens(id: string) {
    try {
      const customer = await this.employeeRepository.findOneOrFail({
        relations: { status: true },
        where: {
          status: { type: EMPLOYEE_STATUS.ACTIVED },
          id,
        }
      });
      return {
        status: CORRECT,
        data: customer
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