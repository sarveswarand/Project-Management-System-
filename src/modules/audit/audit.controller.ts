import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // Get all logs
  @Get()
  @ApiOperation({ summary: 'Get all audit logs' })
  @ApiResponse({
  status: 200,
  description: 'Returns all audit logs',
  schema: {
    example: [
      {
        id: 1,
        action: 'CREATE_TASK',
        userId: 101,
        taskId: 22,
        status: 'SUCCESS',
        timestamp: '2026-05-12T17:30:00.000Z',
      },
    ],
  },
})
  async getAllLogs() {
    return this.auditService.findAll();
  }

  // Filter by userId or action
  @Get('search')
  @ApiOperation({ summary: 'Search audit logs by filters' })
  @ApiQuery({
  name: 'userId',
  required: false,
  example: 101,
  description: 'Filter logs by user ID',
})
  @ApiQuery({
  name: 'action',
  required: false,
  example: 'CREATE_TASK',
  description: 'Filter logs by action type',
})
  @ApiResponse({
  status: 200,
  description: 'Filtered audit logs',
  schema: {
    example: [
      {
        id: 2,
        action: 'DELETE_TASK',
        userId: 101,
        taskId: 22,
        status: 'SUCCESS',
        timestamp: '2026-05-12T17:31:00.000Z',
      },
    ],
  },
})
  async searchLogs(
    @Query('userId') userId?: number,
    @Query('action') action?: string,
  ) {
    return this.auditService.search({ userId, action });
  }
}