import { OrganizationEntity } from '../../entities/organization.entity'
import { CreateBodyDto } from './dtos/create-body.dto'
import { EditBodyDto } from './dtos/edit-body.dto'

export interface OrganizationRepository {
  getOneById: (organizationId: number) => Promise<OrganizationEntity>
  createOne: (createBody: CreateBodyDto) => Promise<OrganizationEntity>
  editOne: (organization: number, editBody: EditBodyDto) => Promise<void>
  removeOne: (organizationId: number) => Promise<void>
}
