import { Response, NextFunction, Request } from 'express'
import { prisma } from '../db'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { OrganizationService } from '../../core/services/organization.service'
import { OrganizationRepositoryImpl } from '../db/repositories/organization.repository.impl'

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
      const organizationData = await this.organizationService.createOne(uuid, createBody)
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
      const { id, orgId } = req.params
      await this.organizationService.setNotFavorite(uuid, +id, +orgId)
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
      await this.organizationService.editOne(uuid, +id, editBody)
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
  new OrganizationService(
    new OrganizationRepositoryImpl(
      prisma.organizations,
      prisma.tools,
      prisma.views,
      prisma.tags,
      prisma.posts,
      prisma.posts_tags,
      prisma.media,
      prisma.favorites,
      prisma.users,
    ),
  ),
)
