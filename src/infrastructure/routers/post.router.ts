import { NextFunction, Request, Response, Router } from 'express'
import fileUpload from 'express-fileupload'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { postController } from '../controllers/post.controller'
import { AuthMiddleware } from '../middlewares/auth/auth.middleware'
import { RoleMiddleware } from '../middlewares/role/role.middleware'

const router = Router()

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => await postController.getOneById(req, res, next),
)

router.post(
  '/:id/viewed',
  [AuthMiddleware, RoleMiddleware.isUser],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.setViewed(req, res, next),
)

router.post(
  '/:id',
  [AuthMiddleware, fileUpload({ limits: { files: 5 } }), RoleMiddleware.isUser],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.createOne(req, res, next),
)

router.patch(
  '/:id',
  [AuthMiddleware, fileUpload({ limits: { files: 5 } }), RoleMiddleware.isUser],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.editOne(req, res, next),
)

router.delete(
  '/:id',
  [AuthMiddleware, RoleMiddleware.isUserOrAdminOrHead],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.removeOne(req, res, next),
)

export const postRouter = router
