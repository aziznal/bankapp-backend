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
  deleteLabel: string;

  /** label for the account which will receive the funds in the account
   * which is being deleted */
  @IsNotEmpty()
  @IsString()
  transferToLabel: string;
}
