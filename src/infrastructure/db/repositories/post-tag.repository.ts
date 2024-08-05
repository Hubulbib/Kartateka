import { posts_tags, Prisma, tags } from '@prisma/client'

export class PostTagRepository {
  constructor(private readonly postsTagsRepository: Prisma.posts_tagsDelegate) {}

  async createManyForPost(postId: number, tags: tags[]): Promise<posts_tags[]> {
    return this.postsTagsRepository.createManyAndReturn({
      data: [...tags.map((el) => ({ post_id: postId, tag_id: el.tag_id }))],
    })
  }

  async removeManyOfPost(postId: number): Promise<void> {
    await this.postsTagsRepository.deleteMany({ where: { post_id: postId } })
  }
}
