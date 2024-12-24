import { PaginationDto } from '@app/common/dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { LeaveEntity } from './entities/leave.entity';
import { LeavesRepository } from './leaves.repository';

@Injectable()
export class LeavesService {
  private readonly logger = new Logger(LeavesService.name);

  constructor(private readonly leavesRepository: LeavesRepository) {}

  private getDifferenceInDays(startDate: Date, endDate: Date) {
    const _startDate = dayjs(startDate);
    const _endDate = dayjs(endDate);

    const diffInDays = dayjs(_endDate).diff(_startDate, 'day');
    if (diffInDays < 0) {
      this.logger.error('Bad request: Start date must be before end date');
      throw new BadRequestException('Start date must be before end date');
    }

    return diffInDays + 1;
  }

  private async checkAvailablity({
    employeeId,
    startDate,
    endDate,
  }: {
    employeeId: number;
    startDate: Date;
    endDate: Date;
  }) {
    const diffInDays = this.getDifferenceInDays(startDate, endDate);

    if (diffInDays > 1) {
      throw new BadRequestException('Maximum 1 day leave per request exceeded');
    }

    const currentYear = new Date().getFullYear();
    const totalLeaveDaysThisYear = await this.leavesRepository
      .getRepositoryBaseQuery('leave')
      .where('leave.employeeId = :employeeId', { employeeId })
      .andWhere('YEAR(leave.startDate) = :currentYear', { currentYear })
      .select('SUM(DATEDIFF(leave.endDate, leave.startDate) + 1)', 'totalDays')
      .getRawOne();

    if ((totalLeaveDaysThisYear?.totalDays || 0) + diffInDays > 12) {
      throw new BadRequestException('Maximum 12 days leave per year exceeded');
    }

    const startMonth = startDate.getMonth() + 1;
    const existingLeaveInSameMonth = await this.leavesRepository
      .getRepositoryBaseQuery('leave')
      .where('leave.employeeId = :employeeId', { employeeId })
      .andWhere('YEAR(leave.startDate) = :currentYear', { currentYear })
      .andWhere('MONTH(leave.startDate) = :startMonth', { startMonth })
      .getCount();

    if (existingLeaveInSameMonth > 0) {
      throw new BadRequestException('Only 1 leave day is allowed per month');
    }
  }

  async create(createLeaveDto: CreateLeaveDto) {
    try {
      const { employeeId, startDate, endDate } = createLeaveDto;

      await this.checkAvailablity({ employeeId, startDate, endDate });

      return this.leavesRepository.create(new LeaveEntity(createLeaveDto));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(filter: PaginationDto) {
    const dataPagination = await this.leavesRepository.pagination({
      filter,
      keySearch: ['firstName', 'lastName', 'email'],
      initialKeySort: 'firstName',
    });

    return dataPagination;
  }

  findAllLeaves(employeeId: number) {
    return this.leavesRepository.findAll({ where: { employeeId } });
  }

  findOne(id: number) {
    return this.leavesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateLeaveDto: UpdateLeaveDto) {
    try {
      const { employeeId, startDate, endDate } = updateLeaveDto;

      await this.checkAvailablity({ employeeId, startDate, endDate });

      return this.leavesRepository.findOneAndUpdate({ id }, updateLeaveDto);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: number) {
    return this.leavesRepository.findOneAndDelete({ id });
  }
}
