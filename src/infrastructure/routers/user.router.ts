import { NextFunction, Response, Router } from 'express'
import { userController } from '../controllers/user.controller'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { AuthMiddleware } from '../middlewares/auth/auth.middleware'
import { RoleMiddleware } from '../middlewares/role/role.middleware'

const router = Router()

router.post(
  '/register',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await userController.register(req, res, next),
)

/*router.post(
  '/subscribe',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await userController.getSubscribe(req, res, next),
)*/

router.get(
  '/favorite-list',
  [AuthMiddleware, RoleMiddleware.isUser],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await userController.getFavoriteList(req, res, next),
)

router.get(
  '/viewed-list',
  [AuthMiddleware, RoleMiddleware.isUser],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await userController.getViewedList(req, res, next),
)

router.get(
  '/type',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await userController.getType(req, res, next),
)

router.get(
  '/:id',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await userController.getOneById(req, res, next),
)

export const userRouter = router
