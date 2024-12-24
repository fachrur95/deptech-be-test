import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LeaveEntity } from './entities/leave.entity';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { LeavesRepository } from './leaves.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([LeaveEntity]),
    Repository,
  ],
  controllers: [LeavesController],
  providers: [LeavesService, LeavesRepository],
  exports: [LeavesService, LeavesRepository],
})
export class LeavesModule {}
