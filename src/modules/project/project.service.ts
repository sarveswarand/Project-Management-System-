import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepo : Repository<Project>,
    ){}

    async createProject(createprojectDto){
       const existingProject = await this.projectRepo.findOne({
    where: { name: createprojectDto.name },
  });

  if (existingProject) {
    throw new BadRequestException(
      `Project with name ${createprojectDto.name} already exists`,
    );
  }
        const project = this.projectRepo.create({
            name: createprojectDto.name,
            description: createprojectDto.description,
            users: createprojectDto.userIds.map((userId) => ({ id: userId })),
        });
        await this.projectRepo.save(project);
        return {message :'project created'};
    }

    async findAll() {
  return this.projectRepo.find({
    relations: ['users'],
  });
}

    async findOne(id: number) {
  return this.projectRepo.findOne({
    where: { id },
    relations: ['users'],
  });
}
    async updateProject(id: number, updateProjectDto) {
        const project = await this.projectRepo.findOne({ where: { id } });
        if(!project){
            throw new Error('Project not found');
        }
        project.name = updateProjectDto.name || project.name;
        project.description = updateProjectDto.description || project.description;
        await this.projectRepo.save(project);
        return project;
    }

    async addUsersToProject(projectId: number, userIds: string[]) {
  const project = await this.projectRepo.findOne({
    where: { id: projectId },
    relations: ['users'],
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  const existingUserIds = new Set(project.users.map(user => user.id));

  
  const newUsers: DeepPartial<User>[] = userIds
  .filter(id => !existingUserIds.has(id))
  .map(id => ({ id }));

project.users = [...project.users, ...newUsers as User[]];
//   const newUsers = userIds
//     .filter(id => !existingUserIds.has(id))
//     .map(id => ({ id }));

//   project.users = [...project.users, ...newUsers];

  return this.projectRepo.save(project);
}

    async remove(id: number) {
  return this.projectRepo.delete(id);
}

}
