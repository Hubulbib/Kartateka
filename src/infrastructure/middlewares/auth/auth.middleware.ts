import jwt from 'jsonwebtoken'
import { type NextFunction, type Request, type Response } from 'express'
import { ApiError } from '../../exceptions/api.exception'
import 'dotenv/config'

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const JWT_SECRET = process.env.SECRET_ACCESS_JWT
    // if (!req.headers.authorization) return next(ApiError.UnauthorizedError())
    //
    // const accessToken = req.headers?.authorization.split(' ')[1]
    //
    // if (!accessToken) {
    //   return next(ApiError.UnauthorizedError()) //res.status(401).end()
    // }

    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYzQ5YTQ4NGEtMzE5OC00YWZlLWE3OTEtNGRhZmQwMGYxZWI4Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM2MzQ2MzM1LCJleHAiOjE3MzYzNDcyMzV9.JFo8_hwmH8sAGGRU79JadcrkezyM6RtNWaudXVvh6Dw`

    const userData = jwt.verify(accessToken, JWT_SECRET, { ignoreExpiration: true })

    if (!userData || typeof userData === 'string') {
      return next(ApiError.BadRequest('Неверные данные')) //res.status(400).end()
    }

    // TODO: fix it
    // @ts-expect-error
    req.auth = {
      user: { ...userData },
      details: {
        ua: req.get('User-Agent'),
        ip: req.ip,
      },
    }

    next()
  } catch (err) {
    next(err)
  }
}
