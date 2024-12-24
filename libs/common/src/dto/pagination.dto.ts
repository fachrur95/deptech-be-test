import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderByDto } from './order-by.dto';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @IsNumber()
  @IsOptional()
  currentPage: number = 1;

  @IsBoolean()
  @IsOptional()
  total?: boolean;

  @ValidateNested()
  @Type(() => OrderByDto)
  @IsOptional()
  orderBy: OrderByDto;

  @IsString()
  @IsOptional()
  search?: string;
}
