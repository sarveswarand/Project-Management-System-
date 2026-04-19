import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('projects')
export class Project{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name !: string;

    @Column()
    description !: string;

    @Column({ type : 'timestamp', default :()=> 'CURRENT_TIMESTAMP'})
    createdAt !: Date;

    @ManyToMany(() => User, user => user.projects)
    @JoinTable()
    users!: User[];

}
