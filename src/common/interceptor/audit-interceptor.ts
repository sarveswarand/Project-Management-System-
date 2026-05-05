import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap, catchError } from 'rxjs';
import { AuditService } from '../../modules/audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMeta = this.reflector.get(
      'audit',
      context.getHandler(),
    );

    if (!auditMeta) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('Audit Interceptor - User:', user);

    return next.handle().pipe(
  tap(async (responseData) => {
    const req = context.switchToHttp().getRequest();

    const userId =
      req.user?.id ||
      req.body?.userId ||
      null;

    const taskId =
      responseData?.id ||         
      responseData?.data?.id ||   
      req.params?.id ||            
      null;

    await this.auditService.createLog({
      action: auditMeta.action,
      userId,
      taskId, 
      payload: req.body,
      result: responseData,
      status: 'SUCCESS',
    });
  }),

  catchError(async (error) => {
    const req = context.switchToHttp().getRequest();

    await this.auditService.createLog({
      action: auditMeta.action,
      userId: req.user?.id || null,
      taskId: req.params?.id || null, 
      payload: req.body,
      error: error.message,
      status: 'FAILED',
    });

    throw error;
  }),
);
  }
}