import { ICommentJob } from '@comment/interfaces/comment.interface'

class CommentService {
  public async addCommentToDB(commentData: ICommentJob)
}

export const commentService: CommentService = new CommentService()
