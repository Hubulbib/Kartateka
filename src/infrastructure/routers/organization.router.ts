import { NextFunction, Request, Response, Router } from 'express'
import fileUpload from 'express-fileupload'
import { organizationController } from '../controllers/organization.controller'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { AuthMiddleware } from '../middlewares/auth/auth.middleware'
import { RoleMiddleware } from '../middlewares/role/role.middleware'
import { OrganizationValidator } from '../validators/organization.validator'

const router = Router()

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => await organizationController.getOneById(req, res, next),
)

router.post(
  '/',
  [fileUpload({ limits: { files: 1, fileSize: 10 * 10 ** 6 } }), AuthMiddleware, OrganizationValidator.createOne],
  async (req: IAuthRequest, res: Response, next: NextFunction) =>
    await organizationController.createOne(req, res, next),
)

router.post(
  '/:id/favorite',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) =>
    await organizationController.setFavorite(req, res, next),
)

router.delete(
  '/:id/favorite/',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) =>
    await organizationController.setNotFavorite(req, res, next),
)

router.patch(
  '/:id',
  [fileUpload({ limits: { files: 1, fileSize: 10 * 10 ** 6 } }), AuthMiddleware, OrganizationValidator.editOne],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await organizationController.editOne(req, res, next),
)

router.delete(
  '/:id',
  [AuthMiddleware],
  async (req: IAuthRequest, res: Response, next: NextFunction) =>
    await organizationController.removeOne(req, res, next),
)

export const organizationRouter = router
