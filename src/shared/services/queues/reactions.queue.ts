import { IReactionJob } from '@reaction/interfaces/reactions.interface'
import { BaseQueue } from '@service/queues/base.queue'
import { reactionsWorker } from '@worker/reactions.worker'

class ReactionsQueue extends BaseQueue {
  constructor() {
    super('reactions')
    this.processJob('addReactionToDB', 5, reactionsWorker.addReactionToDB)
    this.processJob('removeReactionFromDB', 5, reactionsWorker.removeReactionFromDB)
  }

  public addReactionsJob(name: string, data: IReactionJob): void {
    this.addJob(name, data)
  }
}

export const reactionsQueue: ReactionsQueue = new ReactionsQueue()
