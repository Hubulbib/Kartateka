import { Prisma, users } from '@prisma/client'
import { ViewRepository } from './view.repository'
import { FavoriteRepository } from './favorite.repository'
import { PostRepositoryImpl } from './post.repository.impl'
import { PostEntity } from '../../../core/entities/post.entity'
import { EUserType, UserEntity } from '../../../core/entities/user.entity'
import { OrganizationRepositoryImpl } from './organization.repository.impl'
import { OrganizationEntity } from '../../../core/entities/organization.entity'
import { UserRepository } from '../../../core/repositories/user/user.repository'
import { RegisterBodyDto } from '../../../core/repositories/user/dtos/register-body.dto'
import { UserMapper } from '../mappers/user.mapper'

export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly userRepository: Prisma.usersDelegate,
    private readonly organizationRepository: Prisma.organizationsDelegate,
    private readonly toolRepository: Prisma.toolsDelegate,
    private readonly postRepository: Prisma.postsDelegate,
    private readonly mediaRepository: Prisma.mediaDelegate,
    private readonly viewRepository: Prisma.viewsDelegate,
    private readonly favoriteRepository: Prisma.favoritesDelegate,
    private readonly postTagRepository: Prisma.posts_tagsDelegate,
    private readonly tagRepository: Prisma.tagsDelegate,
  ) {}
  async register(registerBody: RegisterBodyDto): Promise<UserEntity> {
    const { userId, ...body } = registerBody
    return await this.convertToFullEntity(await this.userRepository.create({ data: { ...body, user_id: userId } }))
  }

  async getSubscribe(userId: string): Promise<void> {
    await this.userRepository.update({ where: { user_id: userId }, data: { type: 'business' } })
  }

  async getOneById(userId: string): Promise<UserEntity> {
    return await this.convertToFullEntity(await this.userRepository.findFirst({ where: { user_id: userId } }))
  }

  async getFavoriteList(userId: string): Promise<OrganizationEntity[]> {
    const favorites = await new FavoriteRepository(this.favoriteRepository).getAll(userId)
    return Promise.all(
      favorites.map(
        async (el) =>
          await new OrganizationRepositoryImpl(
            this.organizationRepository,
            this.toolRepository,
            this.viewRepository,
            this.tagRepository,
            this.postRepository,
            this.postTagRepository,
            this.mediaRepository,
            this.favoriteRepository,
            this.userRepository,
          ).getOneById(el.organization_id),
      ),
    )
  }

  async getViewedList(userId: string): Promise<PostEntity[]> {
    const views = await new ViewRepository(this.viewRepository).getByUser(userId)
    return Promise.all(
      views.map(
        async (el) =>
          await new PostRepositoryImpl(
            this.postRepository,
            this.postTagRepository,
            this.viewRepository,
            this.mediaRepository,
            this.tagRepository,
          ).getOneById(el.post_id),
      ),
    )
  }

  async getType(userId: string): Promise<EUserType> {
    return EUserType[(await this.userRepository.findFirst({ where: { user_id: userId } })).type]
  }

  private async convertToFullEntity(user: users): Promise<UserEntity> {
    return UserMapper.toDomain(
      user,
      await new OrganizationRepositoryImpl(
        this.organizationRepository,
        this.toolRepository,
        this.viewRepository,
        this.tagRepository,
        this.postRepository,
        this.postTagRepository,
        this.mediaRepository,
        this.favoriteRepository,
        this.userRepository,
      ).getAll(user.user_id),
      await this.getViewedList(user.user_id),
      await this.getFavoriteList(user.user_id),
    )
  }
}
