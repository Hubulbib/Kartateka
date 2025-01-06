export interface FavoriteRepository {
  getAll(userId: string): Promise<{ userId: string; organizationId: number }[]>
  createOne(userId: string, organizationId: number): Promise<{ userId: string; organizationId: number }>
  removeOne(userId: string, organizationId: number): Promise<void>
  removeManyOfOrganization(organizationId: number): Promise<void>
}
