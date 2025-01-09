import { NextFunction, Response } from 'express'
import { body } from 'express-validator'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { ApiError } from '../exceptions/api.exception'
import { EOrganizationType } from '../../core/entities/organization.entity'

export class OrganizationValidator {
  static createOne = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (!req.files['avatar']) {
      next(ApiError.BadRequest('Файл отсутствует'))
    }
    body('name').exists().isString().trim().isLength({ min: 1 })
    body('description').exists().isString().trim().isLength({ min: 1 })
    body('type').exists().isIn(Object.values(EOrganizationType))
    body('address').exists().isString().trim().isLength({ min: 2 })
    body('tools').optional().isArray({ min: 1 })
    next()
  }

  static editOne = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (!req.files['avatar']) {
      next(ApiError.BadRequest('Файл отсутствует'))
    }
    body('name').optional().exists().isString().trim().isLength({ min: 1 })
    body('description').optional().exists().isString().trim().isLength({ min: 1 })
    body('type').optional().exists().isIn(Object.values(EOrganizationType))
    body('address').optional().exists().isString().trim().isLength({ min: 2 })
    body('tools').optional().isArray()
    next()
  }
}
