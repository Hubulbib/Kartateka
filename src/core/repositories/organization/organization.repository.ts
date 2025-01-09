import { OrganizationEntity, type OrganizationEntitySearch } from '../../entities/organization.entity'
import { CreateBodyDto } from './dtos/create-body.dto'
import { EditBodyDto } from './dtos/edit-body.dto'

export interface OrganizationRepository {
  getAll: (userId: string) => Promise<OrganizationEntity[]>
  getOneById: (organizationId: number) => Promise<OrganizationEntity>
  searchByText: (queryText: string) => Promise<OrganizationEntitySearch[]>
  createOne: (userId: string, createBody: CreateBodyDto) => Promise<OrganizationEntity>
  editOne: (organizationId: number, editBody: EditBodyDto) => Promise<void>
  removeOne: (organizationId: number) => Promise<void>
  setFavorite: (userId: string, organizationId: number) => Promise<void>
  setNotFavorite: (userId: string, organizationId: number) => Promise<void>
  checkAccess: (userId: string, organizationId: number) => Promise<void>
}
