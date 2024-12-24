import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { UserSeeder } from '@src/seeders/user.seeder';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([UserEntity]),
    Repository,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserSeeder],
  exports: [UsersService, UsersRepository, UserSeeder],
})
export class UsersModule {}
