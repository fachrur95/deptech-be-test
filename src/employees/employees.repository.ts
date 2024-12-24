import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EmployeeEntity } from './entities/employee.entity';

@Injectable()
export class EmployeesRepository extends AbstractRepository<EmployeeEntity> {
  protected readonly logger = new Logger(EmployeesRepository.name);
  protected readonly entityName = EmployeesRepository.name;

  constructor(
    @InjectRepository(EmployeeEntity)
    repository: Repository<EmployeeEntity>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager);
  }
}
