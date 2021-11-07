import { Body, Controller, Post } from '@nestjs/common';
import { NewUserDto } from './dto/new-user-dto';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post()
  async register(@Body() newUserDto: NewUserDto) {
    const userData = await this.registerService.createUser(newUserDto);

    return { body: 'Great success', createdUserData: userData }
  }
}
