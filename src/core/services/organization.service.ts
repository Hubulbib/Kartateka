import { OrganizationEntity } from '../entities/organization.entity'
import { OrganizationRepository } from '../repositories/organization/organization.repository'
import { EditBodyDto } from '../repositories/organization/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/organization/dtos/create-body.dto'
import { UploadedFile } from 'express-fileupload'
import { StorageService } from './storage.service'
import { UserService } from './user.service'
import { ApiError } from '../../infrastructure/exceptions/api.exception'

export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly storageService: StorageService,
    private readonly userService: UserService,
  ) {}

  getOneById = async (organizationId: number): Promise<OrganizationEntity> => {
    return await this.organizationRepository.getOneById(organizationId)
  }

  createOne = async (
    userId: string,
    createBody: Omit<CreateBodyDto, 'avatar'>,
    file: UploadedFile,
  ): Promise<OrganizationEntity> => {
    if (!(await this.checkAccess(userId))) {
      throw ApiError.NotAccess()
    }
    const [avatar] = await this.storageService.uploadFile(file)
    return await this.organizationRepository.createOne(userId, { ...createBody, avatar })
  }

  setFavorite = async (userId: string, organizationId: number): Promise<void> => {
    return await this.organizationRepository.setFavorite(userId, organizationId)
  }

  setNotFavorite = async (userId: string, organizationId: number): Promise<void> => {
    return await this.organizationRepository.setNotFavorite(userId, organizationId)
  }

  editOne = async (
    userId: string,
    organizationId: number,
    editBody: Omit<EditBodyDto, 'avatar'>,
    file: UploadedFile,
  ): Promise<void> => {
    if (!(await this.checkAccess(userId))) {
      throw ApiError.NotAccess()
    }
    /*
    Checking if user can delete it himself
    await this.organizationRepository.checkAccess(userId, organizationId)
    */
    const [avatar] = await this.storageService.uploadFile(file)
    await this.organizationRepository.editOne(organizationId, { ...editBody, avatar })
  }

  removeOne = async (userId: string, organizationId: number): Promise<void> => {
    if (!(await this.checkAccess(userId))) {
      throw ApiError.NotAccess()
    }
    /*
    Checking if user can delete it himself
    await this.organizationRepository.checkAccess(userId, organizationId)
    */
    await this.organizationRepository.removeOne(organizationId)
  }

  private checkAccess = async (userId: string): Promise<boolean> => {
    return ['admin'].includes(await this.userService.getType(userId))
  }
}
