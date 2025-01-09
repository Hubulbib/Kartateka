import { Prisma, tags } from '@prisma/client'
import { FactoryRepos } from './index'

export class TagRepository {
  constructor(private readonly tagRepository: Prisma.tagsDelegate) {}

  async createManyForPost(postId: number, tags: string[]): Promise<tags[]> {
    const tagCorrectList = tags.filter((el) => this.isCorrectTag(el))
    const createdTags = await this.tagRepository.createManyAndReturn({
      data: [...tagCorrectList.map((el) => ({ name: el }))],
      skipDuplicates: true,
    })

    // creating in join table
    await FactoryRepos.getPostsTagsRepository().createManyForPost(postId, createdTags)

    return createdTags
  }

  async removeManyOfPost(postId: number): Promise<void> {
    await FactoryRepos.getPostsTagsRepository().removeManyOfPost(postId)
  }

  async editMany(postId: number, tags: string[]): Promise<void> {
    await this.removeManyOfPost(postId)
    await this.createManyForPost(postId, tags)
  }

  private isCorrectTag(str: string): boolean {
    return /^[a-zA-Zа-яА-Я0-9]+$/.test(str)
  }
}
