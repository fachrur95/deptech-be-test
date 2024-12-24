import { AbstractEntity } from '@app/common';
import { EmployeeEntity } from '@src/employees/entities/employee.entity';
import { Expose, Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'leaves' })
export class LeaveEntity extends AbstractEntity {
  constructor(partial: Partial<LeaveEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'employee_id' })
  employeeId: number;
  @ManyToOne(() => EmployeeEntity, (employee) => employee.leaves, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @Type(() => EmployeeEntity)
  @JoinColumn({ referencedColumnName: 'id', name: 'employee_id' })
  @Expose()
  employee: EmployeeEntity;

  @Column({ name: 'start_date', type: 'date' })
  @Expose()
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  @Expose()
  endDate: Date;

  @Column({ name: 'reason', nullable: true })
  @Expose()
  reason?: string;
}
