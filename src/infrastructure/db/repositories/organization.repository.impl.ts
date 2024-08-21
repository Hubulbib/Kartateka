import { organizations, Prisma } from '@prisma/client'
import { EOrganizationType, OrganizationEntity } from '../../../core/entities/organization.entity'
import { EditBodyDto } from '../../../core/repositories/organization/dtos/edit-body.dto'
import { CreateBodyDto } from '../../../core/repositories/organization/dtos/create-body.dto'
import { OrganizationRepository } from '../../../core/repositories/organization/organization.repository'
import { OrganizationMapper } from '../mappers/organization.mapper'
import { EUserType } from '../../../core/entities/user.entity'
import { UserRepositoryImpl } from './user.repository.impl'
import { ToolRepositoryImpl } from './tool.repository.impl'
import { PostRepositoryImpl } from './post.repository.impl'
import { FavoriteRepository } from './favorite.repository'
import { ApiError } from '../../exceptions/api.exception'

export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(
    private readonly organizationRepository: Prisma.organizationsDelegate,
    private readonly toolRepository: Prisma.toolsDelegate,
    private readonly viewRepository: Prisma.viewsDelegate,
    private readonly tagRepository: Prisma.tagsDelegate,
    private readonly postRepository: Prisma.postsDelegate,
    private readonly postTagRepository: Prisma.posts_tagsDelegate,
    private readonly mediaRepository: Prisma.mediaDelegate,
    private readonly favoriteRepository: Prisma.favoritesDelegate,
    private readonly userRepository: Prisma.usersDelegate,
  ) {}

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
      const userType = await new UserRepositoryImpl(
        this.userRepository,
        this.organizationRepository,
        this.toolRepository,
        this.postRepository,
        this.mediaRepository,
        this.viewRepository,
        this.favoriteRepository,
        this.postTagRepository,
        this.tagRepository,
      ).getType(userId)
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
    await new ToolRepositoryImpl(this.toolRepository).createMany(organization.organization_id, tools)

    return await this.convertToFullEntity(organization)
  }

  async editOne(userId: string, organizationId: number, editBody: EditBodyDto): Promise<void> {
    const { tools, ...organizationEditBody } = editBody
    await this.checkAccess(userId, organizationId)
    await this.organizationRepository.update({
      where: { organization_id: organizationId },
      data: { ...organizationEditBody, type: EOrganizationType[organizationEditBody.type] },
    })
    await new ToolRepositoryImpl(this.toolRepository).editMany(organizationId, editBody.tools)
  }

  async removeOne(userId: string, organizationId: number): Promise<void> {
    await this.checkAccess(userId, organizationId)
    await new ToolRepositoryImpl(this.toolRepository).removeMany(organizationId)
    await new FavoriteRepository(this.favoriteRepository).removeManyOfOrganization(organizationId)
    await this.organizationRepository.delete({ where: { organization_id: organizationId } })
  }

  async setFavorite(userId: string, organizationId: number): Promise<void> {
    await new FavoriteRepository(this.favoriteRepository).createOne(userId, organizationId)
  }

  async setNotFavorite(userId: string, favoriteId: number, organizationId: number): Promise<void> {
    await new FavoriteRepository(this.favoriteRepository).removeOne(userId, favoriteId, organizationId)
  }

  private async convertToFullEntity(organization: organizations): Promise<OrganizationEntity> {
    return OrganizationMapper.toDomain(
      organization,
      await new ToolRepositoryImpl(this.toolRepository).getAll(organization.organization_id),
      await new PostRepositoryImpl(
        this.postRepository,
        this.postTagRepository,
        this.viewRepository,
        this.mediaRepository,
        this.tagRepository,
      ).getAll(organization.organization_id),
    )
  }

  private async checkAccess(userId: string, organizationId: number) {
    const user = await this.organizationRepository.findFirst({ where: { organization_id: organizationId } }).users()
    if (user.user_id !== userId) {
      throw ApiError.NotAccess('Это не ваша организация')
    }
  }
}
