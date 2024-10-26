import { ItemEntity } from '../entities/item.entity.js'
import { EditBodyDto } from '../repositories/item/dtos/edit-body.dto.js'
import { ItemRepository } from '../repositories/item/item.repository.js'
import { CreateBodyDto } from '../repositories/item/dtos/create-body.dto.js'
import { OrganizationRepository } from '../repositories/organization/organization.repository.js'

export class ItemService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  getAll = async (organizationId: number): Promise<ItemEntity[]> => {
    return await this.itemRepository.getAll(organizationId)
  }

  createOne = async (userId: string, organizationId: number, createBody: CreateBodyDto): Promise<ItemEntity> => {
    await this.organizationRepository.checkAccess(userId, organizationId)
    return await this.itemRepository.createOne(organizationId, createBody)
  }

  editOne = async (userId: string, itemId: number, editBody: EditBodyDto): Promise<void> => {
    const { organizationId } = await this.itemRepository.getOneById(itemId)
    await this.organizationRepository.checkAccess(userId, organizationId)
    await this.itemRepository.editOne(itemId, editBody)
  }

  deleteOne = async (userId: string, itemId: number): Promise<void> => {
    const { organizationId } = await this.itemRepository.getOneById(itemId)
    await this.organizationRepository.checkAccess(userId, organizationId)
    await this.itemRepository.deleteOne(itemId)
  }
}
