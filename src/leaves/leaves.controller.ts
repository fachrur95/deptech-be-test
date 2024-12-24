import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { ApiPagination } from '@app/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards /local-jwt.guard';
import { PaginationDto } from '@app/common/dto';

@ApiTags('Leaves')
@Controller('leaves')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  create(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leavesService.create(createLeaveDto);
  }

  @Get()
  @ApiPagination()
  findAll(@Query(ValidationPipe) filter: PaginationDto) {
    return this.leavesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leavesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveDto: UpdateLeaveDto,
  ) {
    return this.leavesService.update(id, updateLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leavesService.remove(id);
  }
}
