import { views } from '@prisma/client'

export class ViewMapper {
  static toDomain(entity: views): { userId: string; postId: number } {
    return {
      userId: entity.user_id,
      postId: entity.post_id,
    }
  }
}
