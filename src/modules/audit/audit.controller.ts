import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // Get all logs
  @Get()
  async getAllLogs() {
    return this.auditService.findAll();
  }

  // Filter by userId or action
  @Get('search')
  async searchLogs(
    @Query('userId') userId?: number,
    @Query('action') action?: string,
  ) {
    return this.auditService.search({ userId, action });
  }
}