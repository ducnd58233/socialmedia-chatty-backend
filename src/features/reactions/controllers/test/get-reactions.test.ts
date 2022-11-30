import { Request, Response } from 'express'
import { authUserPayload } from '@root/mocks/auth.mock'
import { reactionMockRequest, reactionMockResponse, reactionData } from '@root/mocks/reactions.mock'
import { reactionsService } from '@service/db/reactions.service'
import { ReactionsCache } from '@service/redis/reactions.cache'
import { Get } from '@reaction/controllers/get-reactions'
import { postMockData } from '@root/mocks/post.mock'
import mongoose from 'mongoose'

jest.useFakeTimers()
jest.mock('@service/queues/base.queue')
jest.mock('@service/redis/reactions.cache')

describe('Get', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  describe('reactions', () => {
    it('should send correct json response if reactions exist in cache', async () => {
      const req: Request = reactionMockRequest({}, {}, authUserPayload, {
        postId: `${postMockData._id}`
      }) as Request
      const res: Response = reactionMockResponse()
      jest.spyOn(ReactionsCache.prototype, 'getReactionsFromCache').mockResolvedValue([[reactionData], 1])

      await Get.prototype.reactions(req, res)
      expect(ReactionsCache.prototype.getReactionsFromCache).toHaveBeenCalledWith(`${postMockData._id}`)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post reactions',
        reactions: [reactionData],
        count: 1
      })
    })

    it('should send correct json response if reactions exist in database', async () => {
      const req: Request = reactionMockRequest({}, {}, authUserPayload, {
        postId: `${postMockData._id}`
      }) as Request
      const res: Response = reactionMockResponse()
      jest.spyOn(ReactionsCache.prototype, 'getReactionsFromCache').mockResolvedValue([[], 0])
      jest.spyOn(reactionsService, 'getPostReactions').mockResolvedValue([[reactionData], 1])

      await Get.prototype.reactions(req, res)
      expect(reactionsService.getPostReactions).toHaveBeenCalledWith(
        { postId: new mongoose.Types.ObjectId(`${postMockData._id}`) },
        { createdAt: -1 }
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post reactions',
        reactions: [reactionData],
        count: 1
      })
    })

    it('should send correct json response if reactions list is empty', async () => {
      const req: Request = reactionMockRequest({}, {}, authUserPayload, {
        postId: `${postMockData._id}`
      }) as Request
      const res: Response = reactionMockResponse()
      jest.spyOn(ReactionsCache.prototype, 'getReactionsFromCache').mockResolvedValue([[], 0])
      jest.spyOn(reactionsService, 'getPostReactions').mockResolvedValue([[], 0])

      await Get.prototype.reactions(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post reactions',
        reactions: [],
        count: 0
      })
    })
  })

  describe('singleReactionByUsername', () => {
    it('should send correct json response if reactions exist in cache', async () => {
      const req: Request = reactionMockRequest({}, {}, authUserPayload, {
        postId: `${postMockData._id}`,
        username: postMockData.username
      }) as Request
      const res: Response = reactionMockResponse()
      jest.spyOn(ReactionsCache.prototype, 'getSingleReactionByUsernameFromCache').mockResolvedValue([reactionData, 1])

      await Get.prototype.singleReactionByUsername(req, res)
      expect(ReactionsCache.prototype.getSingleReactionByUsernameFromCache).toHaveBeenCalledWith(
        `${postMockData._id}`,
        postMockData.username
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Single post reaction by username',
        reactions: reactionData,
        count: 1
      })
    })

    it('should send correct json response if reactions exist in database', async () => {
      const req: Request = reactionMockRequest({}, {}, authUserPayload, {
        postId: `${postMockData._id}`,
        username: postMockData.username
      }) as Request
      const res: Response = reactionMockResponse()
      jest.spyOn(ReactionsCache.prototype, 'getSingleReactionByUsernameFromCache').mockResolvedValue([])
      jest.spyOn(reactionsService, 'getSinglePostReactionByUsername').mockResolvedValue([reactionData, 1])

      await Get.prototype.singleReactionByUsername(req, res)
      expect(reactionsService.getSinglePostReactionByUsername).toHaveBeenCalledWith(
        `${postMockData._id}`,
        postMockData.username
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Single post reaction by username',
        reactions: reactionData,
        count: 1
      })
    })

    it('should send correct json response if reactions list is empty', async () => {
      const req: Request = reactionMockRequest({}, {}, authUserPayload, {
        postId: `${postMockData._id}`,
        username: postMockData.username
      }) as Request
      const res: Response = reactionMockResponse()
      jest.spyOn(ReactionsCache.prototype, 'getSingleReactionByUsernameFromCache').mockResolvedValue([])
      jest.spyOn(reactionsService, 'getSinglePostReactionByUsername').mockResolvedValue([])

      await Get.prototype.singleReactionByUsername(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Single post reaction by username',
        reactions: {},
        count: 0
      })
    })
  })

  describe('reactionsByUsername', () => {
    it('should send correct json response if reactions exist in database', async () => {
      const req: Request = reactionMockRequest({}, {}, authUserPayload, {
        username: postMockData.username
      }) as Request
      const res: Response = reactionMockResponse()
      jest.spyOn(reactionsService, 'getReactionsByUsername').mockResolvedValue([reactionData])

      await Get.prototype.reactionsByUsername(req, res)
      expect(reactionsService.getReactionsByUsername).toHaveBeenCalledWith(postMockData.username)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'All user reactions by username',
        reactions: [reactionData]
      })
    })

    it('should send correct json response if reactions list is empty', async () => {
      const req: Request = reactionMockRequest({}, {}, authUserPayload, {
        username: postMockData.username
      }) as Request
      const res: Response = reactionMockResponse()
      jest.spyOn(reactionsService, 'getReactionsByUsername').mockResolvedValue([])

      await Get.prototype.reactionsByUsername(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'All user reactions by username',
        reactions: []
      })
    })
  })
})
