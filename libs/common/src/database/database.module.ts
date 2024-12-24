import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DATABASE_HOST'),
        port: configService.getOrThrow('DATABASE_PORT'),
        database: configService.getOrThrow('DATABASE_NAME'),
        username: configService.getOrThrow('DATABASE_USERNAME'),
        password: configService.getOrThrow('DATABASE_PASSWORD'),
        logging: configService.getOrThrow('DATABASE_LOGGING') || false,
        synchronize: configService.getOrThrow('CURRENT_ENV') !== 'PROD',
        autoLoadEntities: true,
        migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/src/seeders/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/src/migrations/',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
