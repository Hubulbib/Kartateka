import { Prisma, views } from '@prisma/client'

export class ViewRepository {
  constructor(private readonly viewRepository: Prisma.viewsDelegate) {}

  async getCount(postId: number): Promise<number> {
    return this.viewRepository.count({ where: { post_id: postId } })
  }

  async setViewed(postId: number, userId: string): Promise<void> {
    await this.viewRepository.create({ data: { post_id: postId, user_id: userId } })
  }

  async getByUser(userId: string): Promise<views[]> {
    return this.viewRepository.findMany({ where: { user_id: userId } })
  }
}
