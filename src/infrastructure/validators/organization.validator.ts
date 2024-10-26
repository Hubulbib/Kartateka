import { NextFunction, Response } from 'express'
import fileUpload from 'express-fileupload'
import { body } from 'express-validator'
import { IAuthRequest } from '../interfaces/auth.request.interface.js'
import { ApiError } from '../exceptions/api.exception.js'
import { EOrganizationType } from '../../core/entities/organization.entity.js'

export class OrganizationValidator {
  static createOne = (req: IAuthRequest, res: Response, next: NextFunction) => {
    fileUpload({ limits: { files: 1, fileSize: 10 * 10 ** 6 } })
    if (!req.files['avatar']) {
      next(ApiError.BadRequest('Файл отсутствует'))
    }
    body('name').exists().isString().trim().isLength({ min: 1 })
    body('type').exists().isIn(Object.values(EOrganizationType))
    body('address').exists().isString().trim().isLength({ min: 2 })
    body('tools').optional().isArray({ min: 1 })
    next()
  }

  static editOne = (req: IAuthRequest, res: Response, next: NextFunction) => {
    fileUpload({ limits: { files: 1, fileSize: 10 * 10 ** 6 } })
    if (!req.files['avatar']) {
      next(ApiError.BadRequest('Файл отсутствует'))
    }
    body('name').optional().exists().isString().trim().isLength({ min: 1 })
    body('type').optional().exists().isIn(Object.values(EOrganizationType))
    body('address').optional().exists().isString().trim().isLength({ min: 2 })
    body('tools').optional().isArray()
    next()
  }
}
