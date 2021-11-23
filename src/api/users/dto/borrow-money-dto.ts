import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BorrowMoneyDto {
  @IsString()
  @IsNotEmpty()
  borrowingAccountLabel: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
