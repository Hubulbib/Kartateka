import { posts } from '@prisma/client'
import { PostEntity } from '../../../core/entities/post.entity'
import { MediaEntity } from '../../../core/entities/media.entity'

export class PostMapper {
  static toDomain(entity: posts, views: number, tags: string[], media: MediaEntity[]): PostEntity {
    return new PostEntity(
      entity.post_id,
      entity.organization_id,
      entity.title,
      entity.text,
      views,
      entity.created_at,
      entity.updated_at,
      tags,
      media,
    )
  }
}
