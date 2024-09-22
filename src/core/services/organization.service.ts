import { OrganizationEntity } from '../entities/organization.entity'
import { OrganizationRepository } from '../repositories/organization/organization.repository'
import { EditBodyDto } from '../repositories/organization/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/organization/dtos/create-body.dto'
import { UploadedFile } from 'express-fileupload'
import { StorageService } from './storage.service'
import { StorageRepository } from '../repositories/storage/storage.repository'

export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly storageRepository: StorageRepository,
  ) {}

  getOneById = async (organizationId: number): Promise<OrganizationEntity> => {
    return await this.organizationRepository.getOneById(organizationId)
  }

  createOne = async (
    userId: string,
    createBody: Omit<CreateBodyDto, 'avatar'>,
    file: UploadedFile,
  ): Promise<OrganizationEntity> => {
    const [avatar] = await new StorageService(this.storageRepository).uploadFile(file)
    return await this.organizationRepository.createOne(userId, { ...createBody, avatar })
  }

  setFavorite = async (userId: string, organizationId: number): Promise<void> => {
    return await this.organizationRepository.setFavorite(userId, organizationId)
  }

  setNotFavorite = async (userId: string, favoriteId: number, organizationId: number): Promise<void> => {
    return await this.organizationRepository.setNotFavorite(userId, favoriteId, organizationId)
  }

  editOne = async (
    userId: string,
    organizationId: number,
    editBody: Omit<EditBodyDto, 'avatar'>,
    file: UploadedFile,
  ): Promise<void> => {
    await this.organizationRepository.checkAccess(userId, organizationId)
    const [avatar] = await new StorageService(this.storageRepository).uploadFile(file)
    await this.organizationRepository.editOne(organizationId, { ...editBody, avatar })
  }

  removeOne = async (userId: string, organizationId: number): Promise<void> => {
    await this.organizationRepository.checkAccess(userId, organizationId)
    await this.organizationRepository.removeOne(organizationId)
  }
}
