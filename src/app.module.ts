import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './api/auth/auth.module';
import { RegisterModule } from './api/register/register.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './api/users/users.module';

@Module({
  imports: [
    AuthModule,
    RegisterModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://root:example@localhost:27017', {
      dbName: 'bankapp',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
