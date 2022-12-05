import { FollowerModel } from '@follower/models/follower.schema'
import { UserModel } from '@user/models/user.schema'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

class FollowerService {
  public async addFollowerToDB(
    userId: string,
    followeeId: string,
    username: string,
    followerDocumentId: ObjectId
  ): Promise<void> {
    const followerObjectId: ObjectId = new mongoose.Types.ObjectId(userId)
    const followeeObjectId: ObjectId = new mongoose.Types.ObjectId(followeeId)

    await FollowerModel.create({
      _id: followerDocumentId,
      followeeId: followeeObjectId,
      followerId: followerObjectId
    })

    // const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
    //   {
    //     updateOne: {
    //       filter: { _id: userId },
    //       update: { $inc: { followingCount: 1 } }
    //     }
    //   },
    //   {
    //     updateOne: {
    //       filter: { _id: followeeId },
    //       update: { $inc: { followersCount: 1 } }
    //     }
    //   }
    // ])

    await UserModel.updateOne({ _id: userId }, { $inc: { followingCount: 1 } })
    await UserModel.updateOne({ _id: followeeId }, { $inc: { followersCount: 1 } })
    await UserModel.findOne({ _id: userId })

    // await Promise.all([users, UserModel.findOne({ _id: followeeId })])
  }

  public async removeFollowerFromDB(followeeId: string, followerId: string): Promise<void> {
    const followeeObjectId: ObjectId = new mongoose.Types.ObjectId(followeeId)
    const followerObjectId: ObjectId = new mongoose.Types.ObjectId(followerId)

    // const unfollow: Query<IQueryComplete & IQueryDeleted, IFollowerDocument> = FollowerModel.deleteOne({
    //   followeeId: followeeObjectId,
    //   followerId: followerObjectId
    // })

    // const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
    //   {
    //     updateOne: {
    //       filter: { _id: followerId },
    //       update: { $inc: { followingCount: -1 } }
    //     }
    //   },
    //   {
    //     updateOne: {
    //       filter: { _id: followeeId },
    //       update: { $inc: { followersCount: -1 } }
    //     }
    //   }
    // ])

    // await Promise.all([unfollow, users])
    await FollowerModel.deleteOne({
      followeeId: followeeObjectId,
      followerId: followerObjectId
    })

    await UserModel.updateOne({ _id: followeeId }, { $inc: { followersCount: -1 } })
    await UserModel.updateOne({ _id: followerId }, { $inc: { followingCount: -1 } })
  }
}

export const followerService: FollowerService = new FollowerService()
