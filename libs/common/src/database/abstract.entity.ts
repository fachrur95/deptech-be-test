import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  @Expose()
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 100,
    default: 'system',
  })
  @Expose()
  createdBy: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  @Expose()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Expose()
  updatedBy: string;
}
