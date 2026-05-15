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

  async createProject(createprojectDto) {
  const existingProject =
    await this.projectRepo.findOne({
      where: {
        name: createprojectDto.name,
      },
    });

  if (existingProject) {
    throw new BadRequestException(
      `Project with name ${createprojectDto.name} already exists`,
    );
  }

  const project =
    this.projectRepo.create({
      name: createprojectDto.name,
      description:
        createprojectDto.description,
      users:
        createprojectDto.userIds.map(
          (userId) => ({
            id: userId,
          }),
        ),
    });

  const savedProject =
    await this.projectRepo.save(project);

  return savedProject;
}

// Service
async findAll(query) {
  const { page, limit, name, userId } = query;

  const qb = this.projectRepo
    .createQueryBuilder('project')
    .leftJoin('project.users', 'user')
    .select([
      'project.id',
      'project.name',
      'project.description',
      'user.id',
      'user.name',
      'user.email',
    ]);

  // Filter by project name
  if (name) {
    qb.andWhere('project.name LIKE :name', {
      name: `%${name}%`,
    });
  }

  // Filter by assigned user
  if (userId) {
    qb.andWhere('user.id = :userId', {
      userId,
    });
  }

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  // Sorting
  qb.orderBy('project.id', 'DESC');

  const [data, total] = await qb.getManyAndCount();

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
}


// Get one project (only required fields)
async findOne(id: number) {
  const project = await this.projectRepo
    .createQueryBuilder('project')
    .leftJoin('project.users', 'user')
    .select([
      'project.id',
      'project.name',
      'project.description',
      'user.id',
      'user.name',
      'user.email',
    ])
    .where('project.id = :id', { id })
    .getOne();

  if (!project) {
    throw new NotFoundException(
      'Project not found',
    );
  }

  return project;
}

    async remove(id: number) {
  await this.projectRepo.delete(id);
  return { message: 'Project deleted successfully' };
}

// Update Project
async updateProject(id: number, updateProjectDto) {
  const result = await this.projectRepo
    .createQueryBuilder()
    .update(Project)
    .set({
      ...(updateProjectDto.name && { name: updateProjectDto.name }),
      ...(updateProjectDto.description && {
        description: updateProjectDto.description,
      }),
    })
    .where('id = :id', { id })
    .execute();

  if (result.affected === 0) {
    throw new NotFoundException('Project not found');
  }

  return {
    message: 'Project updated successfully',
  };
}


// Add Users To Project
async addUsersToProject(projectId: number, userIds: string[]) {
  const project = await this.projectRepo.findOne({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  for (const userId of userIds) {
  await this.projectRepo
    .createQueryBuilder()
    .relation(Project, 'users')
    .of(projectId)
    .add(userId);
}

  return {
    message: 'Users added successfully',
  };
}

}
