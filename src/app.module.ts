import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        dbName: configService.get<string>('MONGODB_DB_NAME'),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'main.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
