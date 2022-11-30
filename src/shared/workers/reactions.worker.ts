import { config } from '@root/config'
import { reactionsService } from '@service/db/reactions.service'
import { DoneCallback, Job } from 'bull'
import Logger from 'bunyan'

const log: Logger = config.createLogger('reactionsWorker')

class ReactionsWorker {
  async addReactionToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job
      // add method to send data to database
      await reactionsService.addReactionDataToDB(data)
      job.progress(100)
      done(null, job.data)
    } catch (error) {
      log.error(error)
      done(error as Error)
    }
  }

  async removeReactionFromDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job
      // add method to send data to database
      await reactionsService.removeReactionDataFromDB(data)
      job.progress(100)
      done(null, job.data)
    } catch (error) {
      log.error(error)
      done(error as Error)
    }
  }
}

export const reactionsWorker: ReactionsWorker = new ReactionsWorker()
