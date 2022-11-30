import { authMiddleware } from '@global/helpers/auth-middleware'
import express, { Router } from 'express'
import { Add } from '@reaction/controllers/add-reactions'
import { Remove } from '@reaction/controllers/remove-reactions'

class ReactionsRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public routes(): Router {
    this.router.post('/post/reaction', authMiddleware.checkAuthentication, Add.prototype.reaction)
    this.router.delete(
      '/post/reaction/:postId/:previousReaction/:postReactions',
      authMiddleware.checkAuthentication,
      Remove.prototype.reaction
    )

    return this.router
  }
}

export const reactionsRoutes: ReactionsRoutes = new ReactionsRoutes()
