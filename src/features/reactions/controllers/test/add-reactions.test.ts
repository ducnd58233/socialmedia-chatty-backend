import { Request, Response } from 'express'
import { authUserPayload } from '@root/mocks/auth.mock'
import { reactionMockRequest, reactionMockResponse } from '@root/mocks/reactions.mock'
import { ReactionsCache } from '@service/redis/reactions.cache'
import { reactionsQueue } from '@service/queues/reactions.queue'
import { Add } from '@reaction/controllers/add-reactions'

jest.useFakeTimers()
jest.mock('@service/queues/base.queue')
jest.mock('@service/redis/reactions.cache')

describe('AddReaction', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should send correct json response', async () => {
    const req: Request = reactionMockRequest(
      {},
      {
        postId: '6027f77087c9d9ccb1555268',
        previousReaction: 'love',
        profilePicture: 'http://place-hold.it/500x500',
        userTo: '60263f14648fed5246e322d9',
        type: 'like',
        postReactions: {
          like: 1,
          love: 0,
          happy: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      },
      authUserPayload
    ) as Request
    const res: Response = reactionMockResponse()
    const spy = jest.spyOn(ReactionsCache.prototype, 'savePostReactionToCache')
    const reactionSpy = jest.spyOn(reactionsQueue, 'addReactionsJob')

    await Add.prototype.reaction(req, res)
    expect(ReactionsCache.prototype.savePostReactionToCache).toHaveBeenCalledWith(
      spy.mock.calls[0][0],
      spy.mock.calls[0][1],
      spy.mock.calls[0][2],
      spy.mock.calls[0][3],
      spy.mock.calls[0][4]
    )
    expect(reactionsQueue.addReactionsJob).toHaveBeenCalledWith(
      reactionSpy.mock.calls[0][0],
      reactionSpy.mock.calls[0][1]
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Reaction added successfully'
    })
  })
})
