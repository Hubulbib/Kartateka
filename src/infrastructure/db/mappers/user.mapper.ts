import { users } from '@prisma/client'
import { EUserType, UserEntity } from '../../../core/entities/user.entity'
import { OrganizationEntity } from '../../../core/entities/organization.entity'
import { PostEntity } from '../../../core/entities/post.entity'

export class UserMapper {
  static toDomain(
    entity: users,
    organizations: OrganizationEntity[],
    views: PostEntity[],
    favorites: OrganizationEntity[],
  ): UserEntity {
    return new UserEntity(entity.user_id, EUserType[entity.type], organizations, views, favorites)
  }
}
