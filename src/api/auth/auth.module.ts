import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';

import { LoginSchema } from './schemas/login.schema';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

import { jwtConstants } from './constants';

import { AuthController } from './auth.controller';

/**
 * Auth module for handling user authentication and verification
 *
 * @export
 * @class AuthModule
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([{ name: 'Login', schema: LoginSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
