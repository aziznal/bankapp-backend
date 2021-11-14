import { Body, Controller, Post } from '@nestjs/common';
import { NewUserDto } from './dto/new-user-dto';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  /**
   * Registers a new user
   *
   * @param {NewUserDto} newUserDto
   * @memberof RegisterController
   */
  @Post()
  register(@Body() newUserDto: NewUserDto) {
    return this.registerService.create(newUserDto);
  }
}
