import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserEntity } from '@src/users/entities/user.entity';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateToken(user: UserEntity, options?: JwtSignOptions) {
    return this.jwtService.sign({ email: user.email, sub: user.id }, options);
  }

  public generateAccessToken(user: UserEntity) {
    const token = this.generateToken(user);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        this.configService.getOrThrow('JWT_EXPIRATION_IN_SECONDS'),
    );

    return { token, expires };
  }

  public async generateRefreshToken(user: UserEntity) {
    const token = this.generateToken(user, {
      expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_IN_DAYS')}d`,
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });

    return token;
  }
}
