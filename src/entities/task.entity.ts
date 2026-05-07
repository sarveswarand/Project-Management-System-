import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { TaskStatus } from '../common/enums/tasks.enum';
import { Comment } from './comments.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Index()
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status!: TaskStatus;

  @Index()
  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE',
  })
  project!: Project;

  @Index()
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  assignedTo?: User;

  @OneToMany(() => Comment, (comment) => comment.task)
comments!: Comment[];
}