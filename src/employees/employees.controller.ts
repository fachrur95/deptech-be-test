import { ApiPagination } from '@app/common';
import { PaginationDto } from '@app/common/dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an employee' })
  @ApiBody({ type: CreateEmployeeDto })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiPagination()
  findAll(@Query(ValidationPipe) filter: PaginationDto) {
    return this.employeesService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update/patch employee by id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete employee by id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }
}
