import { ReactionsCache } from '@service/redis/reactions.cache'
import { IReactionDocument } from '@reaction/interfaces/reactions.interface'
import { ObjectId } from 'mongodb'
import { joiValidation } from '@global/decorators/joi-validation.decorators'
import HTTP_STATUS from 'http-status-codes'
import { Request, Response } from 'express'
import { addReactionSchema } from '@reaction/schemes/reactions'

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
    res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully' })
  }
}
