import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyCodeRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
