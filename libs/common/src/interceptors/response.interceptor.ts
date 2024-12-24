import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { ResponseDto } from '../dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const classSerializerInterceptor = new ClassSerializerInterceptor(
      this.reflector,
      { excludeExtraneousValues: true },
    );

    // Panggil ClassSerializerInterceptor untuk menangani serialisasi
    const serializedContext = classSerializerInterceptor.intercept(
      context,
      next,
    );

    return serializedContext.pipe(
      map((response) => {
        const message = response.message || 'Request successfully retrieved';
        const description =
          response.description || 'Success! Request successfully retrieved';
        const meta = response.meta || undefined;
        const data = response.data !== undefined ? response.data : response;

        return new ResponseDto({
          success: true,
          message,
          description,
          data,
          error: null,
          meta,
        });
      }),
    );
  }
}
