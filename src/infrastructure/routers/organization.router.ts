import { NextFunction, Request, Response, Router } from 'express'
import fileUpload from 'express-fileupload'
import { organizationController } from '../controllers/organization.controller.js'
import { IAuthRequest } from '../interfaces/auth.request.interface.js'
import { AuthMiddleware } from '../middlewares/auth/auth.middleware.js'
import { RoleMiddleware } from '../middlewares/role/role.middleware.js'
import { OrganizationValidator } from '../validators/organization.validator.js'

const router = Router()

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => await organizationController.getOneById(req, res, next),
)

router.post(
  '/',
  [
    fileUpload({ limits: { files: 1, fileSize: 10 * 10 ** 6 } }),
    AuthMiddleware,
    RoleMiddleware.isAdminOrHead,
    OrganizationValidator.createOne,
  ],
  async (req: IAuthRequest, res: Response, next: NextFunction) =>
    await organizationController.createOne(req, res, next),
)

router.post(
  '/:id/favorite',
  [AuthMiddleware, RoleMiddleware.isUser],
  async (req: IAuthRequest, res: Response, next: NextFunction) =>
    await organizationController.setFavorite(req, res, next),
)

router.delete(
  '/:id/favorite/',
  [AuthMiddleware, RoleMiddleware.isUser],
  async (req: IAuthRequest, res: Response, next: NextFunction) =>
    await organizationController.setNotFavorite(req, res, next),
)

router.patch(
  '/:id',
  [
    fileUpload({ limits: { files: 1, fileSize: 10 * 10 ** 6 } }),
    AuthMiddleware,
    RoleMiddleware.isAdminOrHead,
    OrganizationValidator.editOne,
  ],
  async (req: IAuthRequest, res: Response, next: NextFunction) => await organizationController.editOne(req, res, next),
)

router.delete(
  '/:id',
  [AuthMiddleware, RoleMiddleware.isAdminOrHead],
  async (req: IAuthRequest, res: Response, next: NextFunction) =>
    await organizationController.removeOne(req, res, next),
)

export const organizationRouter = router
