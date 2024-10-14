import { organizations } from '@prisma/client'
import { ToolEntity } from '../../../core/entities/tool.entity'
import { PostEntity } from '../../../core/entities/post.entity'
import { EOrganizationType, OrganizationEntity } from '../../../core/entities/organization.entity'
import { ItemEntity } from '../../../core/entities/item.entity'

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
