import { IsNotEmpty, IsString } from 'class-validator';

export class NewBankingAccountDto {
  /**
   * a label for the account so it's easier for the user to identify this
   * account
   *
   * @type {string}
   * @memberof NewBankingAccountDto
   */
  @IsNotEmpty()
  @IsString()
  label: string;
}
