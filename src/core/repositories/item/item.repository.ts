import { CreateBodyDto } from './dtos/create-body.dto'
import { ItemEntity } from '../../entities/item.entity'
import { EditBodyDto } from './dtos/edit-body.dto'

export interface ItemRepository {
  getAll: (organizationId: number) => Promise<ItemEntity[]>
  getOneById: (itemId: number) => Promise<ItemEntity>
  createOne: (organizationId: number, createBody: CreateBodyDto) => Promise<ItemEntity>
  editOne: (itemId: number, editBody: EditBodyDto) => Promise<void>
  deleteOne: (itemId: number) => Promise<void>
}
