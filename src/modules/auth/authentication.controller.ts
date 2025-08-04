import { Controller } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Auth } from 'src/middlewares/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/middlewares/iam/authentication/enums/auth-type.enum';

Auth(AuthType.None)
@Controller()
export class AuthenticationController {
  constructor(
    private readonly employeeAuthService: AuthenticationService
  ) {}

  @MessagePattern('employeeSignIn')
  async logIn(@Payload() signInDto: SignInDto) {
    console.log('alpha')
    return await this.employeeAuthService.signIn(signInDto)
  }

  @MessagePattern('employeeRefreshToken')
  refresh(@Payload() refreshTokenDto: string) {
    return this.employeeAuthService.refreshTokens(refreshTokenDto);
  }

}