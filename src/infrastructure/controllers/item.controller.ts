import { NextFunction, Response, Request } from 'express'
import { ItemService } from '../../core/services/item.service'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { FactoryRepos } from '../db/repositories'

export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { org_id } = req.params
      const itemData = await this.itemService.getAll(+org_id)
      res.json({ itemData: itemData })
    } catch (err) {
      next(err)
    }
  }

  createOne = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { org_id } = req.params
      const { uuid } = req.auth.user
      const createBody = req.body
      const itemData = await this.itemService.createOne(uuid, +org_id, createBody)
      res.status(201).json({ data: itemData })
    } catch (err) {
      next(err)
    }
  }

  editOne = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { uuid } = req.auth.user
      const editBody = req.body
      await this.itemService.editOne(uuid, +id, editBody)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  deleteOne = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { uuid } = req.auth.user
      await this.itemService.deleteOne(uuid, +id)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
}

export const itemController = new ItemController(
  new ItemService(FactoryRepos.getItemRepository(), FactoryRepos.getOrganizationRepository()),
)
