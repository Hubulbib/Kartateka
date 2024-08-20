import { NextFunction, Request, Response, Router } from 'express'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { postController } from '../controllers/post.controller'

const router = Router()

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => await postController.getOneById(req, res, next),
)

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => await postController.getAll(req, res, next),
)

router.post(
  '/:id',
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.createOne(req, res, next),
)

router.patch(
  '/:id',
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.editOne(req, res, next),
)

router.delete(
  '/:id',
  async (req: IAuthRequest, res: Response, next: NextFunction) => await postController.removeOne(req, res, next),
)

export const postRouter = router
