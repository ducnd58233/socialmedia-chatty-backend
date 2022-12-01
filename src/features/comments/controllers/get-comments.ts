import { ICommentDocument, ICommentNameList } from '@comment/interfaces/comment.interface'
import HTTP_STATUS from 'http-status-codes'
import { Request, Response } from 'express'
import { CommentCache } from '@service/redis/comment.cache'
import { commentService } from '@service/db/comment.service'
import mongoose from 'mongoose'

const commentCache: CommentCache = new CommentCache()

export class Get {
  public async comments(req: Request, res: Response): Promise<void> {
    const { postId } = req.params
    const cachedComments: ICommentDocument[] = await commentCache.getCommentsFromCache(postId)
    const comments: ICommentDocument[] = cachedComments.length
      ? cachedComments
      : await commentService.getPostCommentsFromDB({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 })

    res.status(HTTP_STATUS.OK).json({ message: 'Post comments', comments })
  }

  public async commentsNames(req: Request, res: Response): Promise<void> {
    const { postId } = req.params
    const cachedCommentsNames: ICommentNameList[] = await commentCache.getCommentsNamesFromCache(postId)
    const comments: ICommentNameList[] = cachedCommentsNames.length
      ? cachedCommentsNames
      : await commentService.getPostCommentsNamesFromDB(
          { postId: new mongoose.Types.ObjectId(postId) },
          { createdAt: -1 }
        )

    res.status(HTTP_STATUS.OK).json({ message: 'Post comments names', comments: comments })
  }

  public async singleComment(req: Request, res: Response): Promise<void> {
    const { postId, commentId } = req.params
    const cachedComments: ICommentDocument[] = await commentCache.getSingleCommentFromCache(postId, commentId)
    const comments: ICommentDocument[] = cachedComments.length
      ? cachedComments
      : await commentService.getPostCommentsFromDB({ _id: new mongoose.Types.ObjectId(commentId) }, { createdAt: -1 })

    res.status(HTTP_STATUS.OK).json({ message: 'Single comment', comments: comments[0] })
  }
}
