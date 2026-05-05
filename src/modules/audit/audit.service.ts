import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from 'src/entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
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
}