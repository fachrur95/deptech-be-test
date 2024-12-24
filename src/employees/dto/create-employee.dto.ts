import { GenderEnum } from '@app/common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Fachrur' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Razi' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'fachrurrazi95@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+628123456789' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'Tambun Utara, Kab. Bekasi, Jawa Barat' })
  @IsString()
  address: string;

  @ApiProperty({ example: GenderEnum.MALE })
  @IsEnum(GenderEnum)
  gender: GenderEnum;
}
