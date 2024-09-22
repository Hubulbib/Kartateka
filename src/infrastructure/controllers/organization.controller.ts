import { Response, NextFunction, Request } from 'express'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { OrganizationService } from '../../core/services/organization.service'
import { FactoryRepos } from '../db/repositories'
import { StorageRepositoryImpl } from '../storage/repositories/storage.repository.impl'
import { UploadedFile } from 'express-fileupload'

class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const organizationData = await this.organizationService.getOneById(+id)
      res.status(201).json({ data: { ...organizationData } })
    } catch (err) {
      next(err)
    }
  }

  async createOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const createBody = req.body
      const { avatar } = req.files
      const organizationData = await this.organizationService.createOne(uuid, createBody, avatar as UploadedFile)
      res.status(201).json({ data: { ...organizationData } })
    } catch (err) {
      next(err)
    }
  }

  async setFavorite(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const { id } = req.params
      await this.organizationService.setFavorite(uuid, +id)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  async setNotFavorite(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const { id } = req.params
      await this.organizationService.setNotFavorite(uuid, +id)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  async editOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const { id } = req.params
      const editBody = req.body
      const { avatar } = req.files
      await this.organizationService.editOne(uuid, +id, editBody, avatar as UploadedFile)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  async removeOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        user: { uuid },
      } = req.auth
      const { id } = req.params
      await this.organizationService.removeOne(uuid, +id)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
}

export const organizationController = new OrganizationController(
  new OrganizationService(FactoryRepos.getOrganizationRepository(), new StorageRepositoryImpl()),
)
