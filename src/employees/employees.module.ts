import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesRepository } from './employees.repository';
import { EmployeesService } from './employees.service';
import { EmployeeEntity } from './entities/employee.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([EmployeeEntity]),
    Repository,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
  exports: [EmployeesService, EmployeesRepository],
})
export class EmployeesModule {}
