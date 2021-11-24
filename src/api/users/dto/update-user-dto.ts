import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsDate()
  @IsNotEmpty()
  birthdate: Date;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
