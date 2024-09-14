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

  setFavorite = async (userId: string, organizationId: number): Promise<void> => {
    return await this.organizationRepository.setFavorite(userId, organizationId)
  }

  setNotFavorite = async (userId: string, favoriteId: number, organizationId: number): Promise<void> => {
    return await this.organizationRepository.setNotFavorite(userId, favoriteId, organizationId)
  }

  editOne = async (userId: string, organizationId: number, editBody: EditBodyDto): Promise<void> => {
    await this.organizationRepository.checkAccess(userId, organizationId)
    await this.organizationRepository.editOne(organizationId, editBody)
  }

  removeOne = async (userId: string, organizationId: number): Promise<void> => {
    await this.organizationRepository.checkAccess(userId, organizationId)
    await this.organizationRepository.removeOne(organizationId)
  }
}
