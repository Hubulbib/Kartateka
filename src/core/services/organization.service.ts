import { OrganizationEntity } from '../entities/organization.entity'
import { OrganizationRepository } from '../repositories/organization/organization.repository'
import { EditBodyDto } from '../repositories/organization/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/organization/dtos/create-body.dto'

export class OrganizationService {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  getOneById = async (organizationId: number): Promise<OrganizationEntity> => {
    return await this.organizationRepository.getOneById(organizationId)
  }

  createOne = async (createBody: CreateBodyDto): Promise<OrganizationEntity> => {
    return await this.organizationRepository.createOne(createBody)
  }

  editOne = async (organizationId: number, editBody: EditBodyDto): Promise<void> => {
    await this.organizationRepository.editOne(organizationId, editBody)
  }

  removeOne = async (organizationId: number): Promise<void> => {
    await this.organizationRepository.removeOne(organizationId)
  }
}
