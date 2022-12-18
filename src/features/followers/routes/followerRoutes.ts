import { authMiddleware } from '@global/helpers/auth-middleware'
import express, { Router } from 'express'
import { Add } from '@follower/controllers/follower-user'
import { Remove } from '@follower/controllers/unfollow-user'

class FollowerRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public routes(): Router {
    this.router.patch('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower)
    this.router.patch(
      '/user/unfollow/:followeeId/:followerId',
      authMiddleware.checkAuthentication,
      Remove.prototype.follower
    )

    return this.router
  }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes()