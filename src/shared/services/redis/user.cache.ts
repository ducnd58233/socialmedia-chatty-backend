import { ServerError } from '@global/helpers/error-handlers'
import { BaseCache } from '@service/redis/base.cache'
import { IUserDocument } from '@user/interfaces/user.interface'
import { config } from '@root/config'
import Logger from 'bunyan'
import { Helpers } from '@global/helpers/helpers'

const log: Logger = config.createLogger('userCache')

export class UserCache extends BaseCache {
  constructor() {
    super('userCache')
  }

  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date()
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social
    } = createdUser

    /*
      to store in redis need to convert as a list and value will be string
      even index: Field
      odd index: value
    */
    const firstList: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`
    ]
    const secondList: string[] = [
      'blocked',
      JSON.stringify(blocked), // because it a list
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social)
    ]
    const thirdList: string[] = [
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'bgImageId',
      `${bgImageId}`
    ]
    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList]

    try {
      if (!this.client.isOpen) await this.client.connect()

      // Set key: 'user'. In this key set value 'score' and 'value'. 'score' use to retrieve each item from the set
      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` })
      await this.client.HSET(`users:${key}`, dataToSave)
    } catch (error) {
      log.error(error)
      throw new ServerError('Server error. Try again.')
    }
  }

  public async getUserFromCache(key: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) await this.client.connect()

      // first cast to unknown to make no type. HGETALL get all value from field based on key
      const response: IUserDocument = (await this.client.HGETALL(`users:${key}`)) as unknown as IUserDocument
      // redis stored as string, need to convert back to original type
      response.createdAt = new Date(Helpers.parseJson(`${response.createdAt}`))
      response.postsCount = Helpers.parseJson(`${response.postsCount}`)
      response.blocked = Helpers.parseJson(`${response.blocked}`)
      response.blockedBy = Helpers.parseJson(`${response.blockedBy}`)
      response.notifications = Helpers.parseJson(`${response.notifications}`)
      response.social = Helpers.parseJson(`${response.social}`)
      response.followersCount = Helpers.parseJson(`${response.followersCount}`)
      response.followingCount = Helpers.parseJson(`${response.followingCount}`)

      return response
    } catch (error) {
      log.error(error)
      throw new ServerError('Server error. Try again.')
    }
  }
}
