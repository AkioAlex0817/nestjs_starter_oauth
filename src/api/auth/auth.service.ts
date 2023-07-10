import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { compare as CryptoCompare, hash as CryptoHash } from 'bcrypt';
import { JWT_SECRET } from '../../utils/const';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailVerifyTokensEntity } from '../../database/entities/email-verify-tokens.entity';
import { ForgotPasswordTokensEntity } from '../../database/entities/forgot-password-tokens.entity';
import { generateOTP } from '../../utils/helper';
import { EmailVerifySendDto } from './dto/email-verify-send.dto';
import { VerifyCodeRequestDto } from './dto/verify-code-request.dto';
import * as crypto from 'crypto';
import { ForgetPasswordConfirmDto } from './dto/forget-password-confirm.dto';

export const MINUTES_10 = 10 * 60 * 1000;
export const HOURS_24 = 24 * 60 * 60 * 1000;
export const MONTH_1 = HOURS_24 * 30;
export const MONTH_3 = HOURS_24 * 90;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailerService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailEntityRepo: Repository<UserDetailEntity>,
    @InjectRepository(EmailVerifyTokensEntity)
    private readonly emailVerifyTokenRepo: Repository<EmailVerifyTokensEntity>,
    @InjectRepository(ForgotPasswordTokensEntity)
    private readonly forgetPasswordTokenRepo: Repository<ForgotPasswordTokensEntity>,
  ) {}

  async getTokens(user_id: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user_id,
          email: email,
        },
        {
          secret: JWT_SECRET,
          expiresIn: MONTH_1 / 1000,
        },
      ),
      this.jwtService.signAsync(
        {
          id: user_id,
          email: email,
        },
        {
          secret: JWT_SECRET,
          expiresIn: MONTH_3 / 1000,
        },
      ),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(params: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = params;
    const exist_user: UserEntity = await this.getUserByEmailOrUsername(email, email);
    if (!exist_user) {
      throw new HttpException('Login failed, user not found', HttpStatus.BAD_REQUEST);
    }
    await this.verifyPassword(password, exist_user.password);
    const tokens = await this.getTokens(exist_user.id, exist_user.email);

    exist_user.accessToken = tokens.access_token;
    exist_user.refreshToken = tokens.refresh_token;
    exist_user.expiryAccessDate = new Date(Date.now() + MONTH_1);
    exist_user.expiryRefreshDate = new Date(Date.now() + MONTH_3);

    await this.userRepo.save(exist_user);

    return {
      id: Number(exist_user.id),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expire_in: MONTH_1,
      token_type: 'Bearer',
    };
  }

  async register(params: SignUpDto) {
    const { email, username, password } = params;
    const exist_user = await this.getUserByEmailOrUsername(email, username);
    if (exist_user) {
      throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
    }
    const new_user = await this.createUser({ email: email.toLowerCase(), username, password });
    const user_detail = new UserDetailEntity();
    user_detail.user = new_user;
    await this.userDetailEntityRepo.save(user_detail);

    // create new verify token
    await this.createEmailVerifyToken(new_user);
    return { status: 'Ok', message: 'Success' };
  }

  async verifySend(params: EmailVerifySendDto) {
    const { email } = params;

    const exist_user = await this.getUserByEmailOrUsername(email, email);
    if (!exist_user) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    if (exist_user.verified) {
      throw new HttpException('Your email already verified', HttpStatus.BAD_REQUEST);
    }

    const new_verify_token = await this.createEmailVerifyToken(exist_user);
    if (new_verify_token == null) {
      throw new HttpException('Please try again 10 minutes later', HttpStatus.BAD_REQUEST);
    }

    return { status: 'Ok', message: 'Success' };
  }

  async verifyCodeEmail(params: VerifyCodeRequestDto) {
    const { email, code } = params;
    const exist_user = await this.getUserByEmailOrUsername(email, email);
    if (!exist_user) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    if (exist_user.verified) {
      throw new HttpException('Your email already verified', HttpStatus.BAD_REQUEST);
    }

    const exist_token = await this.getUserEmailVerifyToken(email);
    if (!exist_token) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    if (exist_token.code.toString() !== code) {
      throw new HttpException('Invalid Code', HttpStatus.BAD_REQUEST);
    }

    if (exist_token.expiryDate.getTime() < Date.now()) {
      throw new HttpException('The code expired.', HttpStatus.BAD_REQUEST);
    }

    // update user info
    exist_user.verified = true;
    exist_user.verifiedAt = new Date(Date.now());

    await this.userRepo.save(exist_user);

    return { status: 'Ok', message: 'Success' };
  }

  async logout(userId: number) {
    const exist_user = await this.getUserById(userId);
    if (!exist_user) {
      throw new HttpException('The user not found', HttpStatus.BAD_REQUEST);
    }
    exist_user.accessToken = null;
    exist_user.refreshToken = null;
    exist_user.expiryAccessDate = null;
    exist_user.expiryRefreshDate = null;

    await this.userRepo.save(exist_user);
    return { status: 'Ok', message: 'Success' };
  }

  async refreshTokens(userId: number): Promise<SignInResponseDto> {
    const exist_user = await this.getUserById(userId);
    if (!exist_user) {
      throw new HttpException('The user not found', HttpStatus.BAD_REQUEST);
    }
    const tokens = await this.getTokens(exist_user.id, exist_user.email);

    exist_user.accessToken = tokens.access_token;
    exist_user.refreshToken = tokens.refresh_token;
    exist_user.expiryAccessDate = new Date(Date.now() + MONTH_1);
    exist_user.expiryRefreshDate = new Date(Date.now() + MONTH_3);

    await this.userRepo.save(exist_user);
    return {
      id: Number(exist_user.id),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expire_in: MONTH_1,
      token_type: 'Bearer',
    };
  }

  async forgetPasswordVerifySend(params: EmailVerifySendDto) {
    const { email } = params;
    const exist_user = await this.getUserByEmailOrUsername(email, email);
    if (!exist_user) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    const new_token = await this.createForgetPasswordVerifyToken(exist_user);
    if (new_token == null) {
      throw new HttpException('Please try again 10 minutes later', HttpStatus.BAD_REQUEST);
    }

    return { status: 'Ok', message: 'Success' };
  }

  async forgetPasswordVerifyCode(params: VerifyCodeRequestDto) {
    const { email, code } = params;
    const exist_user = await this.getUserByEmailOrUsername(email, email);
    if (!exist_user) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    const exist_token = await this.getUserForgetPasswordVerifyToken(email);
    if (!exist_token) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    if (exist_token.code.toString() !== code) {
      throw new HttpException('Invalid Code', HttpStatus.BAD_REQUEST);
    }
    if (exist_token.expiryDate.getTime() < Date.now()) {
      throw new HttpException('The code expired.', HttpStatus.BAD_REQUEST);
    }

    return { status: 'Ok', message: 'Success', data: { verify_token: exist_token.verifyToken } };
  }

  async forgetPasswordSetPassword(params: ForgetPasswordConfirmDto) {
    const { email, verify_token, new_password } = params;

    const exist_user = await this.getUserByEmailOrUsername(email, email);
    if (!exist_user) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    const exist_token = await this.getUserForgetPasswordVerifyToken(email);
    if (!exist_token) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    if (exist_token.expiryDate.getTime() < Date.now()) {
      throw new HttpException('The token expired. Please try again.', HttpStatus.BAD_REQUEST);
    }
    if (exist_token.verifyToken != verify_token) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    // save new password
    exist_user.password = await CryptoHash(new_password, 10);
    exist_user.accessToken = null;
    exist_user.refreshToken = null;
    exist_user.expiryAccessDate = null;
    exist_user.expiryRefreshDate = null;

    return { status: 'Ok', message: 'Success' };
  }

  // Helper Function Line
  private async createUser(params: SignUpDto): Promise<UserEntity> {
    const { email, password, username } = params;
    const hashedPassword = await CryptoHash(password, 10);
    const new_user = new UserEntity();
    new_user.email = email;
    new_user.password = hashedPassword;
    new_user.username = username;
    return this.userRepo.save(new_user);
  }

  private async createEmailVerifyToken(user: UserEntity): Promise<EmailVerifyTokensEntity | null> {
    const exist_token = await this.getUserEmailVerifyToken(user.email);
    if (exist_token != null) {
      // check expire at
      if (exist_token.expiryDate.getTime() > Date.now()) {
        return null;
      }
    }

    // create new EmailVerifyToken
    let new_verify_token = new EmailVerifyTokensEntity();
    new_verify_token.email = user.email;
    new_verify_token.code = generateOTP(6);
    new_verify_token.expiryDate = new Date(Date.now() + MINUTES_10);

    new_verify_token = await this.emailVerifyTokenRepo.save(new_verify_token);
    // send verify email
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Verify Email',
      text: new_verify_token.code.toString(),
      //template: 'email_verify',
      /*context: {
        code: new_verify_token.code,
        email: new_verify_token.email,
      },*/
    });

    return new_verify_token;
  }

  private async createForgetPasswordVerifyToken(user: UserEntity): Promise<ForgotPasswordTokensEntity | null> {
    const exist_token = await this.getUserForgetPasswordVerifyToken(user.email);
    if (exist_token != null) {
      // check expire at
      if (exist_token.expiryDate.getTime() > Date.now()) {
        return null;
      }
    }

    // create new ForgetPasswordVerify Token
    let new_forget_password_token = new ForgotPasswordTokensEntity();
    new_forget_password_token.email = user.email;
    new_forget_password_token.code = generateOTP(6);
    new_forget_password_token.verifyToken = crypto.randomBytes(10).toString('hex');
    new_forget_password_token.expiryDate = new Date(Date.now() + MINUTES_10);

    new_forget_password_token = await this.forgetPasswordTokenRepo.save(new_forget_password_token);

    //send forget password email
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Forget Password',
      text: new_forget_password_token.code.toString(),
      //template: 'email_verify',
      /*context: {
        code: new_verify_token.code,
        email: new_verify_token.email,
      },*/
    });
    return new_forget_password_token;
  }

  async getUserByEmailOrUsername(email: string, username: string): Promise<UserEntity | null> {
    const exist = await this.userRepo.findOne({
      where: [{ email: email.toLowerCase() }, { username: username }],
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getUserById(user_id): Promise<UserEntity | null> {
    const exist = await this.userRepo.findOne({
      where: { id: user_id },
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getUserEmailVerifyToken(email: string): Promise<EmailVerifyTokensEntity | null> {
    return await this.emailVerifyTokenRepo.findOne({
      where: {
        email: email,
      },
      order: { id: 'DESC' },
    });
  }

  async getUserForgetPasswordVerifyToken(email: string): Promise<ForgotPasswordTokensEntity | null> {
    return await this.forgetPasswordTokenRepo.findOne({
      where: {
        email: email,
      },
      order: { id: 'DESC' },
    });
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await CryptoCompare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
}
