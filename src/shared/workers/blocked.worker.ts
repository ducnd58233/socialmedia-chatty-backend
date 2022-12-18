import { blockUserService } from '@service/db/block-user.service'
import { DoneCallback, Job } from 'bull'
import Logger from 'bunyan'
import { config } from '@root/config'

const log: Logger = config.createLogger('blockedUserWorker')

class BlockedUserWorker {
  async addBlockedUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { keyOne, keyTwo, type } = job.data
      // add method to send data to database
      if (type === 'block') {
        await blockUserService.blockUser(keyOne, keyTwo)
      } else {
        await blockUserService.unblockUser(keyOne, keyTwo)
      }
      job.progress(100)
      done(null, job.data)
    } catch (error) {
      log.error(error)
      done(error as Error)
    }
  }
}

export const blockedUserWorker: BlockedUserWorker = new BlockedUserWorker()
