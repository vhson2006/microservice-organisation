import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import jwtConfig from './config/jwt.config';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { PermissionsGuard } from './authorization/guards/permission.guard';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from 'src/assets/configs/app.constant';
import { I18nService } from '../globals/i18n/i18n.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE.SEND_EMAIL,
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig)
  ],
  providers: [ 
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    RefreshTokenIdsStorage,
    AccessTokenGuard,
    I18nService,
  ]
})
export class IamModule {}
