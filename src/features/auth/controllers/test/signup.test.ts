import { SignUp } from '@auth/controllers/signup'
import { Request, Response } from 'express'
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload'
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock'
import { CustomError } from '@global/helpers/error-handlers'
import { authService } from '@service/db/auth.service'
import { UserCache } from '@service/redis/user.cache'

jest.useFakeTimers()
jest.mock('@service/queues/base.queue')
jest.mock('@service/queues/user.queue')
jest.mock('@service/queues/auth.queue')
jest.mock('@service/redis/user.cache')
jest.mock('@global/helpers/cloudinary-upload')

describe('SignUp', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should throw an error if username is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: '',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Username is a required field')
    })
  })

  it('should throw an error if username length is less than minimum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'ma',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid username')
    })
  })

  it('should throw an error if username length is greater than maximum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'maasdqweasfasqwe',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid username')
    })
  })

  it('should throw an error if email is not valid', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: 'not valid',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Email must be valid')
    })
  })

  it('should throw an error if email is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: '',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Email is a required field')
    })
  })

  it('should throw an error if password is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: 'manny@test.com',
        password: '',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Password is a required field')
    })
  })

  it('should throw an error if password length is less than minimum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: 'manny@test.com',
        password: 'q',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid password')
    })
  })

  it('should throw an error if password length is greater than maximum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: 'manny@test.com',
        password: 'qwerty123asdads',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid password')
    })
  })

  it('should throw an error if avatarColor is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: '',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('"avatarColor" is not allowed to be empty')
    })
  })

  it('should throw an error if avatarImage is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: ''
      }
    ) as Request
    const res: Response = authMockResponse()

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('"avatarImage" is not allowed to be empty')
    })
  })

  it('should throw unauthorize error if user already exist', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock)

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid credentials')
    })
  })

  it('should set session data for valid credentials and send correct json response', async () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'manny',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()

    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any)
    const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache')
    jest
      .spyOn(cloudinaryUploads, 'uploads')
      .mockImplementation((): any => Promise.resolve({ version: '12345', public_id: '121231' }))

    await SignUp.prototype.create(req, res)
    expect(req.session?.jwt).toBeDefined()
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][2],
      token: req.session?.jwt
    })
  })
})
