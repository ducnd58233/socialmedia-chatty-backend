import { Request, Response } from 'express'
import { reactionMockRequest, reactionMockResponse } from '@root/mocks/reactions.mock'
import { authUserPayload } from '@root/mocks/auth.mock'
import { ReactionsCache } from '@service/redis/reactions.cache'
import { reactionsQueue } from '@service/queues/reactions.queue'
import { Remove } from '@reaction/controllers/remove-reactions'

jest.useFakeTimers()
jest.mock('@service/queues/base.queue')
jest.mock('@service/redis/reactions.cache')

describe('Remove', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should send correct json response', async () => {
    const req: Request = reactionMockRequest({}, {}, authUserPayload, {
      postId: '6027f77087c9d9ccb1555268',
      previousReaction: 'like',
      postReactions: JSON.stringify({
        like: 1,
        love: 0,
        happy: 0,
        wow: 0,
        sad: 0,
        angry: 0
      })
    }) as Request
    const res: Response = reactionMockResponse()
    jest.spyOn(ReactionsCache.prototype, 'removePostReactionFromCache')
    const spy = jest.spyOn(reactionsQueue, 'addReactionsJob')

    await Remove.prototype.reaction(req, res)
    expect(ReactionsCache.prototype.removePostReactionFromCache).toHaveBeenCalledWith(
      '6027f77087c9d9ccb1555268',
      `${req.currentUser?.username}`,
      JSON.parse(req.params.postReactions)
    )
    expect(reactionsQueue.addReactionsJob).toHaveBeenCalledWith(spy.mock.calls[0][0], spy.mock.calls[0][1])
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Reaction removed successfully'
    })
  })
})
