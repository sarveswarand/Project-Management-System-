import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import {Role} from 'src/common/enums/role.enum'
import {Project} from './project.entity'

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ type: 'enum',enum: Role })
    role!: Role;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @ManyToMany(() => Project, project => project.users)
    projects!: Project[];
}