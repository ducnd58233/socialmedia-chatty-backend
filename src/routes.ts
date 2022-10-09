import { postRoutes } from './features/post/routes/postRoutes'
import { currentUserRoutes } from './features/auth/routes/currentRoutes'
import { serverAdapter } from '@service/queues/base.queue'
import { authRoutes } from '@auth/routes/authRoutes'
import { Application } from 'express'
import { authMiddleware } from '@global/helpers/auth-middleware'

const BASE_PATH = '/api/v1'

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter()) // GUI for message queue
    app.use(BASE_PATH, authRoutes.routes())
    app.use(BASE_PATH, authRoutes.signoutRoute())

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes())
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes())
  }

  routes()
}
