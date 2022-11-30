import { ReactionsCache } from '@service/redis/reactions.cache'
import { IReactionDocument, IReactionJob } from '@reaction/interfaces/reactions.interface'
import { ObjectId } from 'mongodb'
import { joiValidation } from '@global/decorators/joi-validation.decorators'
import HTTP_STATUS from 'http-status-codes'
import { Request, Response } from 'express'
import { addReactionSchema } from '@reaction/schemes/reactions'
import { reactionsQueue } from '@service/queues/reactions.queue'

const reactionCache: ReactionsCache = new ReactionsCache()

export class Add {
  @joiValidation(addReactionSchema)
  public async reaction(req: Request, res: Response): Promise<void> {
    const { userTo, postId, type, previousReaction, postReactions, profilePicture } = req.body
    const reactionObject: IReactionDocument = {
      _id: new ObjectId(),
      postId,
      type,
      avatarColor: req.currentUser!.avatarColor,
      username: req.currentUser!.username,
      profilePicture
    } as IReactionDocument

    await reactionCache.savePostReactionToCache(postId, reactionObject, postReactions, type, previousReaction)

    const reactionDataFromDB: IReactionJob = {
      postId,
      userTo,
      userFrom: req.currentUser!.userId,
      username: req.currentUser!.username,
      type,
      previousReaction,
      reactionObject
    }

    reactionsQueue.addReactionsJob('addReactionToDB', reactionDataFromDB)

    res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully' })
  }
}
