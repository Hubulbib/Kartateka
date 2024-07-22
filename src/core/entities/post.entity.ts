import { MediaEntity } from './media.entity'

export class PostEntity {
  constructor(
    readonly postId: number,
    readonly organizationId: number,
    readonly title: string,
    readonly text: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly tags: string[],
    readonly media: MediaEntity[],
  ) {}
}
