import HTTP_STATUS from 'http-status-codes'
import { userService } from '@service/db/user.service'
import { UserCache } from '@service/redis/user.cache'
import { IUserDocument } from '@user/interfaces/user.interface'
import { Request, Response } from 'express'

const userCache: UserCache = new UserCache()

export class CurrentUser {
  /*
  Case: user open browser for the first time or close browser without logout
  */
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false
    let token = null
    let user = null

    // currentUser defined global in auth.interface.ts
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument
    // If user data store in cached NOT exist, check in database (case when redis is downed)
    const existingUser: IUserDocument = cachedUser
      ? cachedUser
      : await userService.getUserById(`${req.currentUser!.userId}`)
    /*
      If it has object and object has value. Avoid something like this:
      { _id: '', username: '' } or {}
    */
    if (Object.keys(existingUser).length) {
      isUser = true
      token = req.session?.jwt
      user = existingUser
    }

    res.status(HTTP_STATUS.OK).json({ token, isUser, user })
  }
}
