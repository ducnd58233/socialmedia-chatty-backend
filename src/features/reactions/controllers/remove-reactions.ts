import { ReactionsCache } from '@service/redis/reactions.cache'
import { IReactionJob } from '@reaction/interfaces/reactions.interface'
import HTTP_STATUS from 'http-status-codes'
import { Request, Response } from 'express'
import { reactionsQueue } from '@service/queues/reactions.queue'

const reactionCache: ReactionsCache = new ReactionsCache()

export class Remove {
  public async reaction(req: Request, res: Response): Promise<void> {
    const { postId, previousReaction, postReactions } = req.params

    await reactionCache.removePostReactionFromCache(postId, `${req.currentUser!.username}`, JSON.parse(postReactions))

    const reactionDataFromDB: IReactionJob = {
      postId,
      username: req.currentUser!.username,
      previousReaction
    }

    reactionsQueue.addReactionsJob('removeReactionFromDB', reactionDataFromDB)

    res.status(HTTP_STATUS.OK).json({ message: 'Reaction remove successfully' })
  }
}
