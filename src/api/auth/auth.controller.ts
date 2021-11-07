import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Post()
  login(@Body() body: Object, @Res({ passthrough: true }) response: Response) {
    console.log(body);
    response.cookie('auth', 'hey');
  }
}
