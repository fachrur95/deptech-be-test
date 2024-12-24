import { AbstractEntity } from '@app/common';
import { GenderEnum } from '@app/common/interfaces';
import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  constructor(partial: Partial<UserEntity>) {
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

  @Column({ name: 'birth_date', type: 'date' })
  @Expose()
  birthDate: Date;

  @Column({ type: 'enum', enum: GenderEnum })
  @Expose()
  gender: GenderEnum;

  @Column()
  password: string;
}
