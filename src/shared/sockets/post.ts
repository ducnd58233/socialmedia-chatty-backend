import { ICommentDocument } from '@comment/interfaces/comment.interface'
import { IReactionDocument } from '@reaction/interfaces/reactions.interface'
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
      socket.on('reaction', (reaction: IReactionDocument) => {
        this.io.emit('update like', reaction)
      })

      socket.on('comment', (data: ICommentDocument) => {
        this.io.emit('update comment', data)
      })
    })
  }
}
