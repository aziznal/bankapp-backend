import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMoneyDto {
  /**
   * Account label from which the user is sending money
   */
  @IsString()
  @IsNotEmpty()
  sendingAccountLabel: string;

  @IsString()
  @IsNotEmpty()
  receiverEmail: string;

  @IsString()
  @IsNotEmpty()
  receivingAccountLabel: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
