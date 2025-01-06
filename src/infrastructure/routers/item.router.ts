import { NextFunction, Request, Response, Router } from 'express'
import { itemController } from '../controllers/item.controller.js'
import { IAuthRequest } from '../interfaces/auth.request.interface.js'
import { AuthMiddleware } from '../middlewares/auth/auth.middleware.js'

const router = Router()

router.get('/:org_id', async (req: Request, res: Response, next: NextFunction) => itemController.getAll(req, res, next))
router.post('/:org_id', [AuthMiddleware], async (req: IAuthRequest, res: Response, next: NextFunction) =>
  itemController.createOne(req, res, next),
)
router.patch('/:id', [AuthMiddleware], async (req: IAuthRequest, res: Response, next: NextFunction) =>
  itemController.editOne(req, res, next),
)
router.delete('/:id', [AuthMiddleware], async (req: IAuthRequest, res: Response, next: NextFunction) =>
  itemController.deleteOne(req, res, next),
)

export const itemRouter = router
