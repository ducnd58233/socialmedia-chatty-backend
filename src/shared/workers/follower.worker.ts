import { DoneCallback, Job } from 'bull'
import Logger from 'bunyan'
import { config } from '@root/config'
import { followerService } from '@service/db/follower.service'

const log: Logger = config.createLogger('followerWorker')

class FollowerWorker {
  async addFollowerToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { followeeId, followerId, username, followerDocumentId } = job.data
      // add method to send data to database
      await followerService.addFollowerToDB(followerId, followeeId, username, followerDocumentId)
      job.progress(100)
      done(null, job.data)
    } catch (error) {
      log.error(error)
      done(error as Error)
    }
  }

  async removeFollowerFromDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { followeeId, followerId } = job.data
      // add method to send data to database
      await followerService.removeFollowerFromDB(followeeId, followerId)
      job.progress(100)
      done(null, job.data)
    } catch (error) {
      log.error(error)
      done(error as Error)
    }
  }
}

export const followerWorker: FollowerWorker = new FollowerWorker()
