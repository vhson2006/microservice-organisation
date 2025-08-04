import { 
  Body, Controller, Delete, Get, Param, Patch, Post, Query 
} from '@nestjs/common';
import { CreateEmployeeDto } from 'src/modules/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from 'src/modules/employee/dto/update-employee.dto';
import { EmployeeService } from 'src/modules/employee/employee.service';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeQueryDto } from 'src/modules/employee/dto/query-employee.dto';
import { CORRECT } from 'src/assets/configs/app.constant';
import { ConfigService } from '@nestjs/config';
import { createObjectCsvWriter } from 'csv-writer';
import { Auth } from 'src/middlewares/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/middlewares/iam/authentication/enums/auth-type.enum';
import { EntityExistsPipe } from 'src/middlewares/globals/entity-exists.pipe';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';
import { UPDATE, CREATE, VIEW, DELETE } from 'src/assets/configs/app.permission';
import { Permissions } from 'src/middlewares/iam/authorization/decorators/permission.decoration';

@Auth(AuthType.Bearer)
@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
    private readonly employeeService: EmployeeService
  ) {}

  @Permissions(`${UPDATE.GROUP}.${UPDATE.EMPLOYEE}`)
  @Patch('mass-change-status')
  async massChangeEmployeeStatus(@Body() params: any) {
    const { selected, status } = params
    return await this.employeeService.massChangeStatus(selected, status);
  }
  
  @Permissions(`${CREATE.GROUP}.${CREATE.EMPLOYEE}`)
  @Post('import')
  async importEmployees(@Body() data: any) {
    const restructureData = data.reduce((pre: any, cur: any, curIndex :any) => {
      if (curIndex === 0) {
        return pre
      }
    
      return [ 
        ...pre, 
        data[0].reduce((pd: any, cd: any, idx: any) => {
          pd[cd] =  cur[idx]
          return pd
        }, {}) 
      ]
    }, [])
    const convertedData = restructureData.map((d: any) => {
      const { 
        Name: name, Identified: identified, Username: username,
        Email: email, Phone: phone, Address: address, 
        'Date of Birth': dob, Status: status, Role: role
      } = d;
      return {
        name, identified, username, email, phone, address, dob, status, role
      }
    })
    return await this.employeeService.importEmployees(convertedData);
  }

  @Permissions(`${VIEW.GROUP}.${VIEW.EMPLOYEE}`)
  @Get('download')
  async downloadEmployee(@Query() query: any) {
    const pathToFile = `${this.configService.get('global.temp')}/employee.csv`;
    const employees = await this.employeeService.findAll(query);
    const csvWriter = createObjectCsvWriter({
      path: pathToFile,
      header: [
        {id: 'name', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.NAME')},
        {id: 'identified', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.IDENTIFIED')},
        {id: 'username', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.USERNAME')},
        {id: 'email', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.EMAIL')},
        {id: 'phone', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.PHONE')},
        {id: 'address', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.ADDRESS')},
        {id: 'dob', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.DOB')},
        {id: 'status', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.STATUS')},
        {id: 'role', title: this.i18nService.translate('DOWNLOAD_EMPLOYEE.ROLE')},
      ]
    })

    await csvWriter.writeRecords(employees.data.map((e: any) => ({
      name: e.name,
      identified: e.identified,
      username: e.username,
      email: e.email,
      phone: e.phone,
      address: e.address,
      dob: e.dob,
      status: e.status ? JSON.parse(e.status.type_name)['en'] : null,
      role: e.role ? JSON.parse(e.role.type_name)['en'] : null
    })));
    return pathToFile
  }

  @Permissions(`${CREATE.GROUP}.${CREATE.EMPLOYEE}`)
  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeeService.create(createEmployeeDto);
  }

  @Permissions(`${VIEW.GROUP}.${VIEW.EMPLOYEE}`)
  @Get()
  async findAll(@Query() query: EmployeeQueryDto) {
    return await this.employeeService.findAll(query)
  }

  @Permissions(`${UPDATE.GROUP}.${UPDATE.EMPLOYEE}`)
  @Get(':id')
  async findOne(@Param('id', EntityExistsPipe(Employee)) employee: Employee) {
    return { 
      status: CORRECT, 
      data: employee
    };
  }
  
  @Permissions(`${UPDATE.GROUP}.${UPDATE.EMPLOYEE}`)
  @Patch(':id')
  async update(
    @Param('id', EntityExistsPipe(Employee)) employee: Employee, 
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    const { id, ...data } = updateEmployeeDto
    return await this.employeeService.update(employee, data);
  }

  @Permissions(`${DELETE.GROUP}.${DELETE.EMPLOYEE}`)
  @Delete(':id')
  async remove(@Param('id', EntityExistsPipe(Employee)) employee: Employee) {
    return await this.employeeService.remove(employee);
  }

  
}
