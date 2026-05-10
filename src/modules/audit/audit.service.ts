import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from 'src/entities/audit-log.entity';
import { AuditLogChanges } from 'src/entities/audit-log-changes.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
    @InjectRepository(AuditLogChanges)
    private auditLogChangesRepo: Repository<AuditLogChanges>,
  ) {}

  async createLog(data: Partial<AuditLog>) {
    const log = this.auditRepo.create({
      ...data,
      timestamp: new Date(),
    });

    return this.auditRepo.save(log);
  }

  async findAll() {
  return this.auditRepo.find({
    order: { timestamp: 'DESC' },
  });
}

async search(filters: { userId?: number; action?: string }) {
  const query = this.auditRepo.createQueryBuilder('audit');

  if (filters.userId) {
    query.andWhere('audit.userId = :userId', { userId: filters.userId });
  }

  if (filters.action) {
    query.andWhere('audit.action = :action', { action: filters.action });
  }

  return query.orderBy('audit.timestamp', 'DESC').getMany();
}

async createLogChange(data: {
  action: string;

  userId?: string;
  userName?: string;

  taskId?: number;
  taskTitle?: string;

  oldValue?: any;
  newValue?: any;

  status?: string;
}) {
  const auditLog = this.auditLogChangesRepo.create({
    action: data.action,

    userId: data.userId,
    // userName: data.userName,

    taskId: data.taskId,
    taskTitle: data.taskTitle,

    oldValue: data.oldValue,
    newValue: data.newValue,

    status: data.status || 'SUCCESS',
  });

  return this.auditLogChangesRepo.save(auditLog);
}
}