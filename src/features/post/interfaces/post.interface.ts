import { IReactions } from '@reaction/interfaces/reactions.interface'
import { ObjectId } from 'mongodb'
import mongoose, { Document } from 'mongoose'

export interface IPostDocument extends Document {
  _id?: string | mongoose.Types.ObjectId
  userId: string
  username: string
  email: string
  avatarColor: string
  profilePicture: string
  post: string
  bgColor: string
  commentsCount: number
  imgVersion?: string // cloudinary
  imgId?: string // cloudinary
  feelings?: string
  gifUrl?: string
  privacy?: string
  reactions?: IReactions
  createdAt?: Date
}

export interface IGetPostsQuery {
  _id?: ObjectId | string
  username?: string
  imgId?: string
  gifUrl?: string
}

export interface ISavePostToCache {
  key: ObjectId | string // postId
  currentUserId: string
  uId: string
  createdPost: IPostDocument
}

export interface IPostJobData {
  key?: ObjectId | string
  value?: IPostDocument
  keyOne?: string
  keyTwo?: string
}

// for mongoose query
export interface IQueryComplete {
  ok?: number
  n?: number
}

export interface IQueryDeleted {
  deletedCount?: number
}
