import { Prisma } from '@prisma/client'
import { ItemEntity } from '../../../core/entities/item.entity'
import { ItemRepository } from '../../../core/repositories/item/item.repository'
import { EditBodyDto } from '../../../core/repositories/item/dtos/edit-body.dto'
import { CreateBodyDto } from '../../../core/repositories/item/dtos/create-body.dto'
import { ItemMapper } from '../mappers/item.mapper'
import { ApiError } from '../../exceptions/api.exception'
import { FactoryRepos } from './index'

export class ItemRepositoryImpl implements ItemRepository {
  constructor(private readonly itemRepository: Prisma.itemsDelegate) {}

  async getAll(organizationId: number): Promise<ItemEntity[]> {
    const organizations = await this.itemRepository.findMany({ where: { organization_id: organizationId } })
    if (!organizations) {
      return []
    }
    return await Promise.all(
      organizations.map(async (el) =>
        ItemMapper.toDomain(el, await FactoryRepos.getVolumeRepository().getAll(el.item_id)),
      ),
    )
  }

  async getOneById(itemId: number): Promise<ItemEntity> {
    const item = await this.itemRepository.findFirst({ where: { item_id: itemId } })
    if (!item) {
      throw ApiError.NotFound('Товар не найден')
    }
    return ItemMapper.toDomain(item, await FactoryRepos.getVolumeRepository().getAll(item.item_id))
  }

  async createOne(organizationId: number, createBody: CreateBodyDto): Promise<ItemEntity> {
    if (await this.itemRepository.findUnique({ where: { name: createBody.name } })) {
      throw ApiError.BadRequest('Товар уже есть')
    }
    const { volumes, ...itemBody } = createBody

    const item = await this.itemRepository.create({ data: { organization_id: organizationId, ...itemBody } })
    await FactoryRepos.getVolumeRepository().createMany(item.item_id, volumes)

    return ItemMapper.toDomain(item, volumes)
  }

  async editOne(itemId: number, editBody: EditBodyDto): Promise<void> {
    const { volumes, ...itemBody } = editBody
    await this.itemRepository.update({ where: { item_id: itemId }, data: itemBody })
    await FactoryRepos.getVolumeRepository().deleteMany(itemId)
    await FactoryRepos.getVolumeRepository().createMany(itemId, volumes)
  }

  async deleteOne(itemId: number): Promise<void> {
    await FactoryRepos.getVolumeRepository().deleteMany(itemId)
    await this.itemRepository.delete({ where: { item_id: itemId } })
  }
}
