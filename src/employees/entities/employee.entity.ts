import { AbstractEntity } from '@app/common';
import { GenderEnum } from '@app/common/interfaces';
import { LeaveEntity } from '@src/leaves/entities/leave.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'employees' })
export class EmployeeEntity extends AbstractEntity {
  constructor(partial: Partial<EmployeeEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Expose()
  phoneNumber: string;

  @Column({ nullable: true })
  @Expose()
  address?: string;

  @Column({ type: 'enum', enum: GenderEnum })
  @Expose()
  gender: GenderEnum;

  @OneToMany(() => LeaveEntity, (leave) => leave.employee)
  @JoinColumn()
  leaves?: LeaveEntity[];
}
