import { socketIOPostObject } from './../../../shared/sockets/post.socket';
import { ObjectId } from 'mongodb';
import { joiValidation } from '@global/decorators/joi-validation.decorators'
import { postSchema } from '@post/schemes/post'
import { Request, Response } from 'express'
import HTTP_STATUS from 'http-status-codes'
import { IPostDocument } from '@post/interfaces/post.interface'
import { PostCache } from '@service/redis/post.cache'

const postCache: PostCache = new PostCache()

export class Create {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } = req.body

    // Create Id for redis, redis not generate object id like mongo
    const postObjectId: ObjectId = new ObjectId()
    const createdPost: IPostDocument = {
      _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount: 0,
      imgVersion: '',
      imgId: '',
      reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 },
      createdAt: new Date(),
    } as unknown as IPostDocument

    socketIOPostObject.emit('add post', createdPost) // user can receive data and don't have to wait to save to cache

    await postCache.savePostToCache({
      key: postObjectId,
      currentUserId: `${req.currentUser!.userId}`,
      uId: `${req.currentUser!.uId}`,
      createdPost: createdPost
    })

    res.status(HTTP_STATUS.CREATED).json({ message: 'Post created successfully' })
  }
}