import { favorites } from '@prisma/client'

export class FavoriteMapper {
  static toDomain(entity: favorites): { userId: string; organizationId: number } {
    return {
      userId: entity.user_id,
      organizationId: entity.organization_id,
    }
  }
}
