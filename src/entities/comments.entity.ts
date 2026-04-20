import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity('comments')
export class comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @ManyToOne(() => Task, (task) => task.comments, {
    onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'taskId' })
    task!: Task;

    @Column()
    userId!: string;


    @ManyToOne(() => comment, (comment) => comment.replies, {
        onDelete: 'CASCADE',
        nullable: true
    })
    @JoinColumn({ name: 'parentId' })
    parent!: comment;

    @OneToMany(() => comment, (comment) => comment.parent)
    replies!: comment[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}