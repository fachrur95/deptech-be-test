import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'fachrurrazi95@gmail.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123@-',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(partial: Partial<LoginDto>) {
    Object.assign(this, partial);
  }
}
