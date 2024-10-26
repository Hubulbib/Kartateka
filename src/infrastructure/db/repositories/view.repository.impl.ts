import { Prisma } from '@prisma/client'
import { ViewRepository } from '../../../core/repositories/view/view.repository.js'
import { ViewMapper } from '../mappers/view.mapper.js'

export class ViewRepositoryImpl implements ViewRepository {
  constructor(private readonly viewRepository: Prisma.viewsDelegate) {}

  async getCount(postId: number): Promise<number> {
    return this.viewRepository.count({ where: { post_id: postId } })
  }

  async setViewed(postId: number, userId: string): Promise<void> {
    await this.viewRepository.create({ data: { post_id: postId, user_id: userId } })
  }

  async getByUser(userId: string): Promise<{ userId: string; postId: number }[]> {
    return (await this.viewRepository.findMany({ where: { user_id: userId } })).map((el) => ViewMapper.toDomain(el))
  }
}
