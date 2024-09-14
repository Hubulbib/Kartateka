import { organizations, Prisma } from '@prisma/client'
import { EOrganizationType, OrganizationEntity } from '../../../core/entities/organization.entity'
import { EditBodyDto } from '../../../core/repositories/organization/dtos/edit-body.dto'
import { CreateBodyDto } from '../../../core/repositories/organization/dtos/create-body.dto'
import { OrganizationRepository } from '../../../core/repositories/organization/organization.repository'
import { OrganizationMapper } from '../mappers/organization.mapper'
import { EUserType } from '../../../core/entities/user.entity'
import { ApiError } from '../../exceptions/api.exception'
import { FactoryRepos } from './index'

export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(private readonly organizationRepository: Prisma.organizationsDelegate) {}

  async getAll(userId: string): Promise<OrganizationEntity[]> {
    return Promise.all(
      (await this.organizationRepository.findMany({ where: { user_id: userId } })).map(
        async (el) => await this.convertToFullEntity(el),
      ),
    )
  }

  async getOneById(organizationId: number): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findFirst({ where: { organization_id: organizationId } })
    return await this.convertToFullEntity(organization)
  }

  async createOne(userId: string, createBody: CreateBodyDto): Promise<OrganizationEntity> {
    const { tools, ...body } = createBody

    const organizationCount = await this.organizationRepository.count({ where: { user_id: userId } })
    if (organizationCount >= 1) {
      const userType = await FactoryRepos.getUserRepository().getType(userId)
      if (userType !== EUserType.business) {
        throw ApiError.NotAccess('У вас нет бизнес аккаунта')
      }
    }
    const organization = await this.organizationRepository.create({
      data: {
        ...body,
        type: EOrganizationType[body.type],
        users: { connect: { user_id: userId } },
      },
    })

    // creating tools of organization
    await FactoryRepos.getToolRepository().createMany(organization.organization_id, tools)

    return await this.convertToFullEntity(organization)
  }

  async editOne(organizationId: number, editBody: EditBodyDto): Promise<void> {
    const { tools, ...organizationEditBody } = editBody
    await this.organizationRepository.update({
      where: { organization_id: organizationId },
      data: { ...organizationEditBody, type: EOrganizationType[organizationEditBody.type] },
    })
    await FactoryRepos.getToolRepository().editMany(organizationId, editBody.tools)
  }

  async removeOne(organizationId: number): Promise<void> {
    await FactoryRepos.getToolRepository().removeMany(organizationId)
    await FactoryRepos.getFavoriteRepository().removeManyOfOrganization(organizationId)
    await this.organizationRepository.delete({ where: { organization_id: organizationId } })
  }

  async setFavorite(userId: string, organizationId: number): Promise<void> {
    await FactoryRepos.getFavoriteRepository().createOne(userId, organizationId)
  }

  async setNotFavorite(userId: string, favoriteId: number, organizationId: number): Promise<void> {
    await FactoryRepos.getFavoriteRepository().removeOne(userId, favoriteId, organizationId)
  }

  private async convertToFullEntity(organization: organizations): Promise<OrganizationEntity> {
    return OrganizationMapper.toDomain(
      organization,
      await FactoryRepos.getToolRepository().getAll(organization.organization_id),
      await FactoryRepos.getPostRepository().getAll(organization.organization_id),
    )
  }

  async checkAccess(userId: string, organizationId: number): Promise<void> {
    const user = await this.organizationRepository.findFirst({ where: { organization_id: organizationId } }).users()
    if (user.user_id !== userId) {
      throw ApiError.NotAccess('Это не ваша организация')
    }
  }
}
