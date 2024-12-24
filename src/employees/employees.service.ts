import { PaginationDto } from '@app/common/dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.repository';
import { EmployeeEntity } from './entities/employee.entity';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(private readonly employeesRepository: EmployeesRepository) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      return this.employeesRepository.create(
        new EmployeeEntity(createEmployeeDto),
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof QueryFailedError) {
        const driverError = (error as any).driverError;
        throw new BadRequestException(driverError.message);
      }

      throw new InternalServerErrorException(error);
    }
  }

  async findAll(filter: PaginationDto) {
    const dataPagination = await this.employeesRepository.pagination({
      filter,
      keySearch: ['firstName', 'lastName', 'email', 'phoneNumber', 'address'],
      initialKeySort: 'firstName',
    });

    return dataPagination;
  }

  async findOne(id: number) {
    return this.employeesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const updatedEmployee = await this.employeesRepository.findOneAndUpdate(
        { id },
        updateEmployeeDto,
      );
      return updatedEmployee;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    return this.employeesRepository.findOneAndDelete({ id });
  }
}
