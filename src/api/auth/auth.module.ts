import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginSchema } from './schemas/login.schema';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Login', schema: LoginSchema }]), UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
