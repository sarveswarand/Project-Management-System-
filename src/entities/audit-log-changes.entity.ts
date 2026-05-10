import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs_changes')
export class AuditLogChanges {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action!: string;

  @Column()
  userId?: string;

//   @Column({ nullable: true })
//   userName?: string;

  @Column()
  taskId?: number;

  @Column({ nullable: true })
  taskTitle?: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  oldValue?: any;

  @Column({
    type: 'json',
    nullable: true,
  })
  newValue?: any;

//   @Column({
//     default: 'SUCCESS',
//   })
//   status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}