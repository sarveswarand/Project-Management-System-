import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { MailerService } from '@nestjs-modules/mailer';

import {
  TASK_ASSIGNED_EVENT,
  TASK_STATUS_UPDATED_EVENT,
} from './task.event';

@Injectable()
export class TaskListener {
  constructor(
    private mailerService: MailerService,
  ) {}

  @OnEvent(TASK_ASSIGNED_EVENT)
  async handleTaskAssigned(payload: any) {
    await this.mailerService.sendMail({
      to: payload.email,

      subject: 'Task Assigned',

      html: `
        <h2>New Task Assigned</h2>

        <p>You have been assigned:</p>

        <b>${payload.title}</b>
      `,
    });

    console.log(
      'Assignment mail sent',
    );
  }

  @OnEvent(TASK_STATUS_UPDATED_EVENT)
  async handleStatusUpdated(
    payload: any,
  ) {
    await this.mailerService.sendMail({
      to: payload.email,

      subject: 'Task Status Updated',

      html: `
        <h2>Status Updated</h2>

        <p>Task: <b>${payload.title}</b></p>

        <p>New Status:
          <b>${payload.status}</b>
        </p>
      `,
    });

    console.log(
      'Status update mail sent',
    );
  }
}