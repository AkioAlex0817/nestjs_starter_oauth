import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserGuard } from './guard/user.guard';
import { UserEntity } from '../../database/entities/user.entity';
import { EmailVerifySendDto } from './dto/email-verify-send.dto';
import { VerifyCodeRequestDto } from './dto/verify-code-request.dto';
import { ForgetPasswordConfirmDto } from './dto/forget-password-confirm.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: SignInDto): Promise<SignInResponseDto> {
    return this.authService.login(body);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: SignUpDto) {
    return this.authService.register(body);
  }

  @Get('email/verify-send')
  @HttpCode(HttpStatus.OK)
  verifySend(@Query() body: EmailVerifySendDto) {
    return this.authService.verifySend(body);
  }

  @Post('email/verify-code')
  @HttpCode(HttpStatus.OK)
  verifyCodeEmail(@Body() body: VerifyCodeRequestDto) {
    return this.authService.verifyCodeEmail(body);
  }

  @UseGuards(UserGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    const user = <UserEntity>req.user;
    return this.authService.logout(user.id);
  }

  @UseGuards(UserGuard)
  @Post('refresh_token')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: any) {
    const user = <UserEntity>req.user;
    return this.authService.refreshTokens(user.id);
  }

  @Get('forget_password/verify-send')
  @HttpCode(HttpStatus.OK)
  forgetPasswordVerifySend(@Query() body: EmailVerifySendDto) {
    return this.authService.forgetPasswordVerifySend(body);
  }

  @Post('forget_password/verify-code')
  @HttpCode(HttpStatus.OK)
  forgetPasswordVerifyCode(@Body() body: VerifyCodeRequestDto) {
    return this.authService.forgetPasswordVerifyCode(body);
  }

  @Post('forget_password/set-password')
  @HttpCode(HttpStatus.OK)
  forgetPasswordResetPassword(@Body() body: ForgetPasswordConfirmDto) {
    return this.authService.forgetPasswordSetPassword(body);
  }
}
