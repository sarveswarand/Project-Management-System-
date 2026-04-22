import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity('comments')
export class Comment {
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


    @ManyToOne(() => Comment, (comment) => comment.replies, {
        onDelete: 'CASCADE',
        nullable: true
    })
    @JoinColumn({ name: 'parentId' })
    parent?: Comment;

    @OneToMany(() => Comment, (comment) => comment.parent)
    replies!: Comment[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}