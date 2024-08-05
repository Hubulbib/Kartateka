import { OrganizationEntity } from '../entities/organization.entity'
import { OrganizationRepository } from '../repositories/organization/organization.repository'
import { EditBodyDto } from '../repositories/organization/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/organization/dtos/create-body.dto'

export class OrganizationService {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  getOneById = async (organizationId: number): Promise<OrganizationEntity> => {
    return await this.organizationRepository.getOneById(organizationId)
  }

  createOne = async (userId: string, createBody: CreateBodyDto): Promise<OrganizationEntity> => {
    return await this.organizationRepository.createOne(userId, createBody)
  }

  editOne = async (userId: string, organizationId: number, editBody: EditBodyDto): Promise<void> => {
    await this.organizationRepository.editOne(userId, organizationId, editBody)
  }

  removeOne = async (userId: string, organizationId: number): Promise<void> => {
    await this.organizationRepository.removeOne(userId, organizationId)
  }
}
