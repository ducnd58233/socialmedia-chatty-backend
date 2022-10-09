import { postWorker } from '@worker/post.worker'
import { IPostJobData } from '@post/interfaces/post.interface'
import { BaseQueue } from '@service/queues/base.queue'

class PostQueue extends BaseQueue {
  constructor() {
    super('posts')
    this.processJob('addPostToDB', 5, postWorker.savePostToDB) // job name can be anything not related to service
  }

  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data)
  }
}

export const postQueue: PostQueue = new PostQueue()
