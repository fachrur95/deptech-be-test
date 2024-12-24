import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { LeaveEntity } from './entities/leave.entity';

@Injectable()
export class LeavesRepository extends AbstractRepository<LeaveEntity> {
  protected readonly logger = new Logger(LeavesRepository.name);
  protected readonly entityName = LeavesRepository.name;

  constructor(
    @InjectRepository(LeaveEntity)
    repository: Repository<LeaveEntity>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
