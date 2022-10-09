import { ServerError } from '@global/helpers/error-handlers'
import { BaseCache } from '@service/redis/base.cache'
import { config } from '@root/config'
import Logger from 'bunyan'
import { Helpers } from '@global/helpers/helpers'
import { ISavePostToCache } from '@post/interfaces/post.interface'

const log: Logger = config.createLogger('postCache')

export class PostCache extends BaseCache {
  constructor() {
    super('postCache')
  }

  public async savePostToCache(data: ISavePostToCache): Promise<void> {
    const { key, currentUserId, uId, createdPost } = data
    const {
      _id,
      userId,
      username,
      email,
      avatarColor,
      profilePicture,
      post,
      bgColor,
      commentsCount,
      imgVersion, // cloudinary
      imgId, // cloudinary
      gifUrl,
      privacy,
      reactions,
      createdAt
    } = createdPost

    // original is string
    const firstList: string[] = [
      '_id', `${_id}`,
      'userId', `${userId}`,
      'username', `${username}`,
      'email', `${email}`,
      'avatarColor', `${avatarColor}`,
      'profilePicture', `${profilePicture}`,
      'post',`${post}`,
      'bgColor',`${bgColor}`,
      'gifUrl', `${gifUrl}`,
      'privacy', `${privacy}`
    ]

    const secondList: string[] = [
      'commentsCount', `${commentsCount}`,
      'reactions', JSON.stringify(reactions),
      'imgVersion', `${imgVersion}`,
      'imgId', `${imgId}`,
      'createdAt', `${createdAt}`
    ]

    const dataToSave: string[] = [...firstList, ...secondList]

    try {
      if (!this.client.isOpen) {
        await this.client.connect()
      }

      const postsCount: string[] = await this.client.HMGET(`users:${currentUserId}`, 'postsCount')
      const multi: ReturnType<typeof this.client.multi> = this.client.multi()
      multi.ZADD('post', { score: parseInt(uId, 10), value: `${key}` } )
      multi.HSET(`posts:${key}`, dataToSave)
      const count: number = parseInt(postsCount[0], 10) + 1
      multi.HSET(`users:${currentUserId}`, ['postsCount', count])
      multi.exec()
    } catch (error) {
      log.error(error)
      throw new ServerError('Server error. Try again.')
    }
  }
}