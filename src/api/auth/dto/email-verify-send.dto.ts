import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailVerifySendDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
