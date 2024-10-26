import { organizations } from '@prisma/client'
import { ToolEntity } from '../../../core/entities/tool.entity.js'
import { PostEntity } from '../../../core/entities/post.entity.js'
import { EOrganizationType, OrganizationEntity } from '../../../core/entities/organization.entity.js'
import { ItemEntity } from '../../../core/entities/item.entity.js'

export class OrganizationMapper {
  static toDomain(
    entity: organizations,
    tools: ToolEntity[],
    posts: PostEntity[],
    items: ItemEntity[],
  ): OrganizationEntity {
    return new OrganizationEntity(
      entity.organization_id,
      entity.avatar,
      entity.name,
      EOrganizationType[entity.type],
      entity.address,
      tools,
      posts,
      items,
    )
  }
}
