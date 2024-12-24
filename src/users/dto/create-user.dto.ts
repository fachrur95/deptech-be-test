import { GenderEnum } from '@app/common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Fachrur' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Razi' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'fachrurrazi95@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '1995-11-27' })
  @IsDate()
  birthDate: Date;

  @ApiProperty({ example: GenderEnum.MALE })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ example: 'Password123@-' })
  @IsString()
  password: string;
}
