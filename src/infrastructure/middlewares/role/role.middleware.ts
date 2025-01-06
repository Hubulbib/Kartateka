import { NextFunction, Response } from 'express'
import { IAuthRequest } from '../../interfaces/auth.request.interface.js'
import { ApiError } from '../../exceptions/api.exception.js'

export class RoleMiddleware {
  static isUnverified = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.auth.user.role !== 'unverified') {
      next(ApiError.NotAccess())
    }
    next()
  }

  static isUser = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.auth.user.role !== 'user') {
      next(ApiError.NotAccess())
    }
    next()
  }

  static isAdmin = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.auth.user.role !== 'admin') {
      next(ApiError.NotAccess())
    }
    next()
  }

  static isHead = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.auth.user.role !== 'head') {
      next(ApiError.NotAccess())
    }
    next()
  }

  static isAdminOrHead = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.auth.user.role !== 'head' && req.auth.user.role !== 'admin') {
      next(ApiError.NotAccess())
    }
    next()
  }

  static isUserOrAdminOrHead = (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.auth.user.role !== 'head' && req.auth.user.role !== 'admin' && req.auth.user.role !== 'user') {
      next(ApiError.NotAccess())
    }
    next()
  }
}
