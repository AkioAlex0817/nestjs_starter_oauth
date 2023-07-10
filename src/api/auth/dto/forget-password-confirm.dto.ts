import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordConfirmDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  verify_token: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;
}
