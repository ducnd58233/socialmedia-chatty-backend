import { commentRoutes } from '@comment/routes/commentRoutes'
import { reactionsRoutes } from '@reaction/routes/reactionsRoutes'
import { postRoutes } from '@post/routes/postRoutes'
import { currentUserRoutes } from '@auth/routes/currentRoutes'
import { serverAdapter } from '@service/queues/base.queue'
import { authRoutes } from '@auth/routes/authRoutes'
import { Application } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'
import { followerRoutes } from '@follower/routes/followerRoutes'

const BASE_PATH = '/api/v1'

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter()) // GUI for message queue
    app.use(BASE_PATH, authRoutes.routes())
    app.use(BASE_PATH, authRoutes.signoutRoute())

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes())
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes())
    app.use(BASE_PATH, authMiddleware.verifyUser, reactionsRoutes.routes())
    app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes())
    app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes())
  }

  routes()
}
