import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginSchema } from './schemas/login.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Login', schema: LoginSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
