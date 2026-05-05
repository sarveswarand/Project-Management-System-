import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action!: string;

  @Column({ type: 'varchar', nullable: true })
  userId!: string;

  @Column({ nullable: true })
  taskId!: number;

  @Column({ type: 'json', nullable: true })
  payload: any;

  @Column({ type: 'json', nullable: true })
  result: any;

  @Column({ nullable: true })
  status!: string; // SUCCESS / FAILED

  @Column({ nullable: true })
  error!: string;

  @CreateDateColumn()
  timestamp!: Date;
}