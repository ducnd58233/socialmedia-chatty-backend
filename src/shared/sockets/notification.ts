import { Server } from 'socket.io'

let socketIONotificationObject: Server

// This class only use for listen event
export class SocketIONotificationHandler {
  public listen(io: Server): void {
    socketIONotificationObject = io
  }
}

export { socketIONotificationObject }
