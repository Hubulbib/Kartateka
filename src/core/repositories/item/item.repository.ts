import { CreateBodyDto } from './dtos/create-body.dto.js'
import { ItemEntity } from '../../entities/item.entity.js'
import { EditBodyDto } from './dtos/edit-body.dto.js'

export interface ItemRepository {
  getAll: (organizationId: number) => Promise<ItemEntity[]>
  getOneById: (itemId: number) => Promise<ItemEntity>
  createOne: (organizationId: number, createBody: CreateBodyDto) => Promise<ItemEntity>
  editOne: (itemId: number, editBody: EditBodyDto) => Promise<void>
  deleteOne: (itemId: number) => Promise<void>
}
