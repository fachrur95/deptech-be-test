import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository extends AbstractRepository<UserEntity> {
  protected readonly logger = new Logger(UsersRepository.name);
  protected readonly entityName = UsersRepository.name;

  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
