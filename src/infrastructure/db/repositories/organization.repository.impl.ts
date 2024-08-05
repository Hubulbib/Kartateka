import { organizations, Prisma } from '@prisma/client'
import { EOrganizationType, OrganizationEntity } from '../../../core/entities/organization.entity'
import { EditBodyDto } from '../../../core/repositories/organization/dtos/edit-body.dto'
import { CreateBodyDto } from '../../../core/repositories/organization/dtos/create-body.dto'
import { OrganizationRepository } from '../../../core/repositories/organization/organization.repository'
import { OrganizationMapper } from '../mappers/organization.mapper'
import { ToolRepositoryImpl } from './tool.repository.impl'
import { PostRepositoryImpl } from './post.repository.impl'
import { FavoriteRepository } from './favorite.repository'

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
    const organization = await this.organizationRepository.create({
      data: {
        ...createBody,
        type: EOrganizationType[createBody.type],
        users: { connect: { user_id: userId } },
      },
    })
    return await this.convertToFullEntity(organization)
  }

  async editOne(userId: string, organizationId: number, editBody: EditBodyDto): Promise<void> {
    const { tools, ...organizationEditBody } = editBody
    const organization = await this.organizationRepository.findFirst({
      where: { organization_id: organizationId },
    })
    if (organization.user_id !== userId) {
      throw Error('Это не ваша организация')
    }
    await this.organizationRepository.update({
      where: { organization_id: organizationId },
      data: { ...organizationEditBody, type: EOrganizationType[organizationEditBody.type] },
    })
    await new ToolRepositoryImpl(this.toolRepository).editMany(organization.organization_id, editBody.tools)
  }

  async removeOne(userId: string, organizationId: number): Promise<void> {
    const organization = await this.organizationRepository.findFirst({ where: { organization_id: organizationId } })
    if (organization.user_id !== userId) {
      throw Error('Это не ваша организация')
    }
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
}
