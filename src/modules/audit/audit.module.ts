import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from 'src/entities/audit-log.entity';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLogChanges } from 'src/entities/audit-log-changes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, AuditLogChanges]),
  ],
  providers: [
    AuditService,
  ],
  controllers: [
    AuditController,
  ],
  exports: [
    AuditService, // 👈 VERY IMPORTANT (needed for interceptor)
  ],
})
export class AuditModule {}