import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { OrderBy } from '../interfaces';

export function ApiPagination() {
  return applyDecorators(
    ApiQuery({ name: 'page', type: Number, required: false }),
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({ name: 'search', type: String, required: false }),
    ApiQuery({ name: 'orderBy[name]', type: String, required: false }),
    ApiQuery({ name: 'orderBy[direction]', enum: OrderBy, required: false }),
  );
}
