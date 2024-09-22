import { favorites, Prisma } from '@prisma/client'

export class FavoriteRepository {
  constructor(private readonly favoriteRepository: Prisma.favoritesDelegate) {}

  async getAll(userId: string): Promise<favorites[]> {
    return this.favoriteRepository.findMany({ where: { user_id: userId } })
  }

  async createOne(userId: string, organizationId: number): Promise<favorites> {
    return this.favoriteRepository.create({ data: { user_id: userId, organization_id: organizationId } })
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
