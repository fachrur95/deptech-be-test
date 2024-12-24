import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import dayjs from 'dayjs';

export class CreateLeaveDto {
  @ApiProperty({ example: '1' })
  @IsNumber()
  @IsNotEmpty()
  employeeId: number;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), default: new Date() })
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), default: new Date() })
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: 'Sakit' })
  @IsString()
  @IsOptional()
  reason?: string;
}
