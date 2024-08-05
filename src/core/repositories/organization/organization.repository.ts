import { OrganizationEntity } from '../../entities/organization.entity'
import { CreateBodyDto } from './dtos/create-body.dto'
import { EditBodyDto } from './dtos/edit-body.dto'

export interface OrganizationRepository {
  getAll: (userId: string) => Promise<OrganizationEntity[]>
  getOneById: (organizationId: number) => Promise<OrganizationEntity>
  createOne: (userId: string, createBody: CreateBodyDto) => Promise<OrganizationEntity>
  editOne: (userId: string, organizationId: number, editBody: EditBodyDto) => Promise<void>
  removeOne: (userId: string, organizationId: number) => Promise<void>
  setFavorite: (userId: string, organizationId: number) => Promise<void>
  setNotFavorite: (userId: string, favoriteId: number, organizationId: number) => Promise<void>
}
