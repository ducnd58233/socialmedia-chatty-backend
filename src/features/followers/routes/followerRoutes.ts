import { authMiddleware } from '@global/helpers/auth-middleware'
import express, { Router } from 'express'
import { Add } from '@follower/controllers/follower-user'
import { Remove } from '@follower/controllers/unfollow-user'
import { Get } from '@follower/controllers/get-followers'
import { Blocked } from '@follower/controllers/block-user'

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

    this.router.patch('/user/block/:followerId', authMiddleware.checkAuthentication, Blocked.prototype.block)
    this.router.patch('/user/unblock/:followerId', authMiddleware.checkAuthentication, Blocked.prototype.unblock)

    this.router.get('/user/following', authMiddleware.checkAuthentication, Get.prototype.userFollowing)
    this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, Get.prototype.userFollowers)

    return this.router
  }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes()
