import { UserModel } from '@user/models/user.schema'
import mongoose from 'mongoose'
import { PushOperator, PullOperator } from 'mongodb'

class BlockUserService {
  public async blockUser(userId: string, followerId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId, blocked: { $ne: new mongoose.Types.ObjectId(followerId) } },
      { $push: { blocked: new mongoose.Types.ObjectId(followerId) } as PushOperator<Document> }
    )
    await UserModel.updateOne(
      { _id: followerId, blockedBy: { $ne: new mongoose.Types.ObjectId(userId) } },
      { $push: { blockedBy: new mongoose.Types.ObjectId(userId) } as PushOperator<Document> }
    )
  }

  public async unblockUser(userId: string, followerId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { blocked: new mongoose.Types.ObjectId(followerId) } as PullOperator<Document> }
    )
    await UserModel.updateOne(
      { _id: followerId },
      { $pull: { blockedBy: new mongoose.Types.ObjectId(userId) } as PullOperator<Document> }
    )
  }
}

export const blockUserService: BlockUserService = new BlockUserService()
