import { emailWorker } from './../../workers/email.worker'
import { IEmailJob } from '@user/interfaces/user.interface'
import { userWorker } from '@worker/user.worker'
import { BaseQueue } from '@service/queues/base.queue'

class EmailQueue extends BaseQueue {
  constructor() {
    super('emails')
    this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificationEmail)
  }

  public addEmailJob(name: string, data: IEmailJob): void {
    this.addJob(name, data)
  }
}

export const emailQueue: EmailQueue = new EmailQueue()
