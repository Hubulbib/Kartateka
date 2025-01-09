import { MediaEntity } from './media.entity'

export class PostEntity {
  constructor(
    readonly postId: number,
    readonly organizationId: number,
    readonly views: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly media: MediaEntity[],
    readonly title?: string,
    readonly text?: string,
    readonly tags?: string[],
  ) {}
}

export type PostEntityShort = Pick<PostEntity, 'postId' | 'media'>
