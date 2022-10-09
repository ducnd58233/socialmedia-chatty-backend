import { Server, Socket } from 'socket.io'

export let socketIOPostObject: Server

// This class only use for listen event
export class SocketIOPostHandler {
  private io: Server

  constructor(io: Server) {
    this.io = io
    socketIOPostObject = io
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Post socketio handler')
    })
  }
}
