import { postService } from './../services/db/post.service'
import { Job, DoneCallback } from 'bull'
import Logger from 'bunyan'
import { config } from '@root/config'

const log: Logger = config.createLogger('authWorker')

class PostWorker {
  async savePostToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, value } = job.data
      // add method to send data to database
      await postService.addPostToDB(key, value)
      job.progress(100)
      done(null, job.data)
    } catch (error) {
      log.error(error)
      done(error as Error)
    }
  }

  async deletePostFromDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { keyOne, keyTwo } = job.data
      await postService.deletePost(keyOne, keyTwo)
      job.progress(100)
      done(null, job.data)
    } catch (error) {
      log.error(error)
      done(error as Error)
    }
  }

  async updatePostInDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, value } = job.data
      await postService.updatePost(key, value)
      job.progress(100)
      done(null, job.data)
    } catch (error) {
      log.error(error)
      done(error as Error)
    }
  }
}

export const postWorker: PostWorker = new PostWorker()
