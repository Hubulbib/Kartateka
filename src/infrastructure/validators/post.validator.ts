import { NextFunction, Response } from 'express'
import fileUpload from 'express-fileupload'
import { body } from 'express-validator'
import { IAuthRequest } from '../interfaces/auth.request.interface.js'
import { ApiError } from '../exceptions/api.exception.js'

export class PostValidator {
  static createOne = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (!req.files['media']) {
      next(ApiError.BadRequest('Файлы отсутствуют'))
    }
    body('media').exists().isArray({ min: 1 })
    body('title').optional().exists().isString().trim().isLength({ min: 1 })
    body('text').optional().exists().isString().isLength({ min: 1 })
    body('tags').optional().isArray()
    next()
  }

  static editOne = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (!req.files['media']) {
      next(ApiError.BadRequest('Файлы отсутствуют'))
    }
    body('media').optional().exists().isArray({ min: 1 })
    body('title').optional().exists().isString().trim().isLength({ min: 1 })
    body('text').optional().exists().isString().isLength({ min: 1 })
    body('tags').optional().isArray()
    next()
  }
}
