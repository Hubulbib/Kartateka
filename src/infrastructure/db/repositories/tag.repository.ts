import { Prisma, tags } from '@prisma/client'
import { PostTagRepository } from './post-tag.repository'

export class TagRepository {
  constructor(
    private readonly tagRepository: Prisma.tagsDelegate,
    private readonly postsTagsRepository: Prisma.posts_tagsDelegate,
  ) {}

  async createManyForPost(postId: number, tags: string[]): Promise<tags[]> {
    const tagCorrectList = tags.filter((el) => this.isCorrectTag(el))
    const createdTags = await this.tagRepository.createManyAndReturn({
      data: [...tagCorrectList.map((el) => ({ name: el }))],
      skipDuplicates: true,
    })

    // creating in join table
    await new PostTagRepository(this.postsTagsRepository).createManyForPost(postId, createdTags)

    return createdTags
  }

  async removeManyOfPost(postId: number): Promise<void> {
    await new PostTagRepository(this.postsTagsRepository).removeManyOfPost(postId)
  }

  async editMany(postId: number, tags: string[]): Promise<void> {
    await this.removeManyOfPost(postId)
    await this.createManyForPost(postId, tags)
  }

  private isCorrectTag(str: string): boolean {
    return /^[a-zA-Zа-яА-Я0-9]+$/.test(str)
  }
}
