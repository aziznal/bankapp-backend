import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  birthdate?: Date;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
