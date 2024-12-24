import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([UserEntity]),
    Repository,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
