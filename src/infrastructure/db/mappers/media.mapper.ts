import { media } from '@prisma/client'
import { EMediaType, MediaEntity } from '../../../core/entities/media.entity.js'

export class MediaMapper {
  static toDomain(entity: media): MediaEntity {
    return new MediaEntity(
      entity.media_id,
      entity.post_id,
      entity.url,
      EMediaType[entity.type],
      entity.number,
      entity.created_at,
    )
  }
}
