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

export const HOURS_24 = 24 * 60 * 60;
export const MONTH_1 = HOURS_24 * 30;
export const MONTH_3 = HOURS_24 * 90;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailEntityRepo: Repository<UserDetailEntity>,
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
          expiresIn: MONTH_1,
        },
      ),
      this.jwtService.signAsync(
        {
          id: user_id,
          email: email,
        },
        {
          secret: JWT_SECRET,
          expiresIn: MONTH_3,
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

  async refreshTokens(userId: number) {
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

  private async createUser(params: SignUpDto): Promise<UserEntity> {
    const { email, password, username } = params;
    const hashedPassword = await CryptoHash(password, 10);
    const new_user = new UserEntity();
    new_user.email = email;
    new_user.password = hashedPassword;
    new_user.username = username;
    return this.userRepo.save(new_user);
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

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await CryptoCompare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
}
