import { BadRequestError } from './../../../shared/globals/helpers/error-handlers'
import { postSchema, postWithImageSchema } from '@post/schemes/post'
import { Request, Response } from 'express'
import HTTP_STATUS from 'http-status-codes'
import { IPostDocument } from '@post/interfaces/post.interface'
import { PostCache } from '@service/redis/post.cache'
import { postQueue } from '@service/queues/post.queue'
import { socketIOPostObject } from '@socket/post.socket'
import { joiValidation } from '@global/decorators/joi-validation.decorators'
import { UploadApiResponse } from 'cloudinary'
import { uploads } from '@global/helpers/cloudinary-upload'

const postCache: PostCache = new PostCache()

export class Update {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    Update.prototype.updatePost(req)

    res.status(HTTP_STATUS.OK).json({ message: 'Post updated successfully' })
  }

  @joiValidation(postWithImageSchema)
  public async postWithImage(req: Request, res: Response): Promise<void> {
    const { imgId, imgVersion } = req.body
    if (imgId && imgVersion) {
      Update.prototype.updatePost(req)
    } else {
      const result: UploadApiResponse = await Update.prototype.addImageToExistingPost(req)
      if (!result.public_id) throw new BadRequestError(result.message)
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Post with image updated successfully' })
  }

  private async updatePost(req: Request): Promise<void> {
    const { post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture } = req.body
    const { postId } = req.params
    const updatedPostDocument: IPostDocument = {
      post,
      bgColor,
      privacy,
      feelings,
      gifUrl,
      profilePicture,
      imgId,
      imgVersion
    } as IPostDocument

    const updatedPost: IPostDocument = await postCache.updatePostInCache(postId, updatedPostDocument)
    socketIOPostObject.emit('update post', updatedPost, 'posts')
    postQueue.addPostJob('updatePostInDB', { key: postId, value: updatedPost })
  }

  private async addImageToExistingPost(req: Request): Promise<UploadApiResponse> {
    const { post, bgColor, feelings, privacy, gifUrl, image, profilePicture } = req.body
    const { postId } = req.params
    const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse

    if (!result?.public_id) return result

    const updatedPostDocument: IPostDocument = {
      post,
      bgColor,
      privacy,
      feelings,
      gifUrl,
      profilePicture,
      imgId: result.public_id,
      imgVersion: result.version.toString()
    } as IPostDocument

    const updatedPost: IPostDocument = await postCache.updatePostInCache(postId, updatedPostDocument)
    socketIOPostObject.emit('update post', updatedPost, 'posts')
    postQueue.addPostJob('updatePostInDB', { key: postId, value: updatedPost })

    return result
  }
}
