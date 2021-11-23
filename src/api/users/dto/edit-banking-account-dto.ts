import { IsNotEmpty, IsString } from 'class-validator';

export class EditBankingAccountDto {
  /**
   * account's old label
   *
   * @type {string}
   * @memberof EditBankingAccountDto
   */
  @IsNotEmpty()
  @IsString()
  oldLabel: string;

  /**
   * account's new label
   *
   * @type {string}
   * @memberof EditBankingAccountDto
   */
  @IsNotEmpty()
  @IsString()
  newLabel: string;
}
