import { JoiRequestValidationError } from '@global/helpers/error-handlers'
import { Request } from 'express'
import { ObjectSchema } from 'joi'

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, _descriptor: PropertyDescriptor) => {
    const originalMethod = _descriptor.value
    _descriptor.value = async function (...args: any[]) {
      const req: Request = args[0]
      const { error } = await Promise.resolve(schema.validate(req.body))

      if (error?.details) throw new JoiRequestValidationError(error.details[0].message)
      return originalMethod.apply(this, args)
    }
    return _descriptor
  }
}
