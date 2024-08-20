import { Response, NextFunction } from 'express'
import { prisma } from '../db'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { UserService } from '../../core/services/user.service'
import { UserRepositoryImpl } from '../db/repositories/user.repository.impl'

class UserController {
  constructor(private readonly userService: UserService) {}
  async register(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const userData = await this.userService.register({ userId: uuid })
      res.status(201).json({ data: { ...userData } })
    } catch (err) {
      next(err)
    }
  }

  async getSubscribe(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      await this.userService.getSubscribe(uuid)
      res.status(200)
    } catch (err) {
      next(err)
    }
  }

  async getOneById(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const userData = await this.userService.getOneById(uuid)
      res.status(201).json({ data: { ...userData } })
    } catch (err) {
      next(err)
    }
  }

  async getFavoriteList(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const userData = await this.userService.getFavoriteList(uuid)
      res.status(201).json({ data: { ...userData } })
    } catch (err) {
      next(err)
    }
  }

  async getViewedList(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const userData = await this.userService.getViewedList(uuid)
      res.status(201).json({ data: { ...userData } })
    } catch (err) {
      next(err)
    }
  }

  async getType(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const userData = await this.userService.getType(uuid)
      res.status(201).json({ data: { userType: userData } })
    } catch (err) {
      next(err)
    }
  }
}

export const userController = new UserController(
  new UserService(
    new UserRepositoryImpl(
      prisma.users,
      prisma.organizations,
      prisma.tools,
      prisma.posts,
      prisma.media,
      prisma.views,
      prisma.favorites,
      prisma.posts_tags,
      prisma.tags,
    ),
  ),
)
