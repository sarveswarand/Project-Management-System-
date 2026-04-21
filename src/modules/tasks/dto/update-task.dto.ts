import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { TaskStatus } from '../../../common/enums/tasks.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}