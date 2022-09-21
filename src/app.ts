import { ChattyServer } from './setupServer'
import databaseConnection from './setupDatabase'
import express, { Express } from 'express'
import { config } from './config'

class Application {
  public start(): void {
    this.loadConfig()
    databaseConnection()
    const app: Express = express()
    const server: ChattyServer = new ChattyServer(app)
    server.start()
  }

  private loadConfig(): void {
    config.validateConfig()
  }
}

const application: Application = new Application()
application.start()
