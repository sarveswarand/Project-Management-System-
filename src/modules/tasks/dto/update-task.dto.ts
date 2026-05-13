import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { TaskStatus } from '../../../common/enums/tasks.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty()
  userId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiProperty({enum:TaskStatus,example:TaskStatus.IN_PROGRESS,description:"Update the status of the task"})
  status?: TaskStatus;
}