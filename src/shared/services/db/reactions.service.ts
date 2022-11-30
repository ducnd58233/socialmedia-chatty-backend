import { IPostDocument } from '@post/interfaces/post.interface'
import { PostModel } from '@post/models/post.schema'
import { IReactionDocument, IReactionJob } from '@reaction/interfaces/reactions.interface'
import { ReactionModel } from '@reaction/models/reactions.schema'
import { UserCache } from '@service/redis/user.cache'
import { IUserDocument } from '@user/interfaces/user.interface'
import { omit } from 'lodash'

const userCace: UserCache = new UserCache()

class ReactionService {
  public async addReactionDataToDB(reactionData: IReactionJob): Promise<void> {
    const { postId, userTo, userFrom, username, type, previousReaction, reactionObject } = reactionData
    let updatedReactionObject: IReactionDocument = reactionObject as IReactionDocument
    if (previousReaction) {
      updatedReactionObject = omit(reactionObject, ['_id'])
    }
    const updatedReaction: [IUserDocument, IReactionDocument, IPostDocument] = (await Promise.all([
      userCace.getUserFromCache(`${userTo}`),
      ReactionModel.replaceOne({ postId, type: previousReaction, username }, updatedReactionObject, { upsert: true }),
      PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: {
            [`reactions.${previousReaction}`]: -1,
            [`reactions.${type}`]: 1
          }
        },
        { new: true }
      )
    ])) as unknown as [IUserDocument, IReactionDocument, IPostDocument]

    // send reactions notification
  }

  public async removeReactionDataFromDB(reactionData: IReactionJob): Promise<void> {
    const { postId, previousReaction, username } = reactionData
    await Promise.all([
      ReactionModel.deleteOne({ postId, type: previousReaction, username }),
      PostModel.updateOne(
        { _id: postId },
        {
          $inc: {
            [`reactions.${previousReaction}`]: -1
          }
        },
        { new: true }
      )
    ])
  }
}

export const reactionsService: ReactionService = new ReactionService()