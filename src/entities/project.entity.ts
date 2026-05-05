import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";

@Entity('projects')
export class Project{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    name !: string;

    @Column()
    description !: string;

    @Column({ type : 'timestamp', default :()=> 'CURRENT_TIMESTAMP'})
    createdAt !: Date;

    @ManyToMany(() => User, user => user.projects)
    @JoinTable()
    users!: User[];

    @OneToMany(() => Task, (task) => task.project)
    tasks!: Task[];

}
