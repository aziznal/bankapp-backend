import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteBankingAccountDto {
  /**
   * label of the account to be deleted
   *
   * @type {string}
   * @memberof DeleteBankingAccountDto
   */
  @IsNotEmpty()
  @IsString()
  label: string;
}
