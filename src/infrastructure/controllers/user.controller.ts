import { Response, NextFunction } from 'express'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { UserService } from '../../core/services/user.service'
import { FactoryRepos } from '../db/repositories'

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

  /*async getSubscribe(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      await this.userService.getSubscribe(uuid)
      res.status(200)
    } catch (err) {
      next(err)
    }
  }*/

  async getOneById(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const userData = await this.userService.getOneById(uuid)
      res.json({ data: { ...userData } })
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
      res.json({ data: { ...userData } })
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
      res.json({ data: { ...userData } })
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
      res.json({ data: { userType: userData } })
    } catch (err) {
      next(err)
    }
  }
}

export const userController: UserController = new UserController(
  new UserService(
    FactoryRepos.getUserRepository(),
    FactoryRepos.getViewRepository(),
    FactoryRepos.getFavoriteRepository(),
    FactoryRepos.getOrganizationRepository(),
    FactoryRepos.getPostRepository(),
  ),
)
