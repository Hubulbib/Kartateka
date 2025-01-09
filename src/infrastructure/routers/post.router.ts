import { NextFunction, Request, Response, Router } from 'express'
import fileUpload from 'express-fileupload'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { postController } from '../controllers/post.controller'
import { AuthMiddleware } from '../middlewares/auth/auth.middleware'
import { RoleMiddleware } from '../middlewares/role/role.middleware'
import { PostValidator } from '../validators/post.validator'

const router = Router()

router.get(
  '/recommended',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.getRecommended(req, res, next),
)

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => await postController.getOneById(req, res, next),
)

router.post(
  '/:id/viewed',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.setViewed(req, res, next),
)

router.post(
  '/:id',
  [fileUpload({ limits: { files: 5 } }), AuthMiddleware, PostValidator.createOne],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.createOne(req, res, next),
)

router.patch(
  '/:id',
  [fileUpload({ limits: { files: 5 } }), AuthMiddleware, PostValidator.editOne],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.editOne(req, res, next),
)

router.delete(
  '/:id',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.removeOne(req, res, next),
)

export const postRouter = router
