import { Prisma } from '@prisma/client'
import { FavoriteRepository } from '../../../core/repositories/favorite/favorite.repository.js'
import { FavoriteMapper } from '../mappers/favorite.mapper.js'

export class FavoriteRepositoryImpl implements FavoriteRepository {
  constructor(private readonly favoriteRepository: Prisma.favoritesDelegate) {}

  async getAll(userId: string): Promise<{ userId: string; organizationId: number }[]> {
    return (await this.favoriteRepository.findMany({ where: { user_id: userId } })).map((el) =>
      FavoriteMapper.toDomain(el),
    )
  }

  async createOne(userId: string, organizationId: number): Promise<{ userId: string; organizationId: number }> {
    return FavoriteMapper.toDomain(
      await this.favoriteRepository.create({ data: { user_id: userId, organization_id: organizationId } }),
    )
  }

  async removeOne(userId: string, organizationId: number): Promise<void> {
    await this.favoriteRepository.delete({
      where: {
        user_id_organization_id: {
          user_id: userId,
          organization_id: organizationId,
        },
      },
    })
  }

  async removeManyOfOrganization(organizationId: number): Promise<void> {
    await this.favoriteRepository.deleteMany({
      where: {
        organization_id: organizationId,
      },
    })
  }
}
