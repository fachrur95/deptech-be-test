import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@src/users/entities/user.entity';
import { UsersService } from '@src/users/users.service';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators /current-user.decorator';
import { LoginDto } from './dto /login.dto';
import { JwtAuthGuard } from './guards /local-jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.verifyUser(
      loginDto.email,
      loginDto.password,
    );
    const { token, expires } = this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
      secure: this.configService.get<string>('CURRENT_ENV') !== 'DEV',
    });

    return {
      email: user.email,
      token: {
        accessToken: token,
        refreshToken,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('session')
  async currentSession(@CurrentUser() user: UserEntity) {
    return user;
  }
}
