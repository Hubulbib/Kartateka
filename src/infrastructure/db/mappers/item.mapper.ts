import { items } from '@prisma/client'
import { EItemType, ItemEntity } from '../../../core/entities/item.entity.js'

export class ItemMapper {
  static toDomain(entity: items, volumes: string[]): ItemEntity {
    return new ItemEntity(
      entity.item_id,
      entity.organization_id,
      entity.name,
      EItemType[entity.type],
      entity.image,
      entity.price,
      entity.description,
      volumes,
    )
  }
}
