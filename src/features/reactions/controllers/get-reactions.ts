import { ReactionsCache } from '@service/redis/reactions.cache'
import { IReactionDocument } from '@reaction/interfaces/reactions.interface'
import HTTP_STATUS from 'http-status-codes'
import { Request, Response } from 'express'
import { reactionsService } from '@service/db/reactions.service'
import mongoose from 'mongoose'

const reactionCache: ReactionsCache = new ReactionsCache()

export class Get {
  public async reactions(req: Request, res: Response): Promise<void> {
    const { postId } = req.params
    const cachedReactions: [IReactionDocument[], number] = await reactionCache.getReactionsFromCache(postId)
    const reactions: [IReactionDocument[], number] = cachedReactions[0].length
      ? cachedReactions
      : await reactionsService.getPostReactions({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 })

    res.status(HTTP_STATUS.OK).json({ message: 'Post reactions', reactions: reactions[0], count: reactions[1] })
  }

  public async singleReactionByUsername(req: Request, res: Response): Promise<void> {
    const { postId, username } = req.params
    const cachedReaction: [IReactionDocument, number] | [] = await reactionCache.getSingleReactionByUsernameFromCache(
      postId,
      username
    )
    const reactions: [IReactionDocument, number] | [] = cachedReaction.length
      ? cachedReaction
      : await reactionsService.getSinglePostReactionByUsername(postId, username)

    res.status(HTTP_STATUS.OK).json({
      message: 'Single post reaction by username',
      reactions: reactions.length ? reactions[0] : {},
      count: reactions.length ? reactions[1] : 0
    })
  }

  public async reactionsByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params
    const reactions: IReactionDocument[] = await reactionsService.getReactionsByUsername(username)

    res.status(HTTP_STATUS.OK).json({ message: 'All user reactions by username', reactions })
  }
}
