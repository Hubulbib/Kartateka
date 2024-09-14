import { Prisma, users } from '@prisma/client'
import { PostEntity } from '../../../core/entities/post.entity'
import { UserEntity } from '../../../core/entities/user.entity'
import { OrganizationEntity } from '../../../core/entities/organization.entity'
import { UserRepository } from '../../../core/repositories/user/user.repository'
import { RegisterBodyDto } from '../../../core/repositories/user/dtos/register-body.dto'
import { UserMapper } from '../mappers/user.mapper'
import { FactoryRepos } from './index'
import { ApiError } from '../../exceptions/api.exception'

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userRepository: Prisma.usersDelegate) {}
  async register(registerBody: RegisterBodyDto): Promise<UserEntity> {
    const { userId, ...body } = registerBody
    return await this.convertToFullEntity(await this.userRepository.create({ data: { ...body, user_id: userId } }))
  }

  /*async getSubscribe(userId: string): Promise<void> {
    await this.userRepository.update({ where: { user_id: userId }, data: { type: 'business' } })
  }*/

  async getOneById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findFirst({ where: { user_id: userId } })
    if (!user) {
      throw ApiError.NotFound('Пользователь отсутствует')
    }
    return await this.convertToFullEntity(user)
  }

  async getFavoriteList(userId: string): Promise<OrganizationEntity[]> {
    const favorites = await FactoryRepos.getFavoriteRepository().getAll(userId)
    return Promise.all(
      favorites.map(async (el) => await FactoryRepos.getOrganizationRepository().getOneById(el.organization_id)),
    )
  }

  async getViewedList(userId: string): Promise<PostEntity[]> {
    const views = await FactoryRepos.getViewRepository().getByUser(userId)
    return Promise.all(views.map(async (el) => await FactoryRepos.getPostRepository().getOneById(el.post_id)))
  }

  async getType(userId: string): Promise<string> {
    const user = await this.userRepository.findFirst({ where: { user_id: userId } })
    if (!user) {
      throw ApiError.NotFound('Пользователь отсутствует')
    }
    return user.type
  }

  private async convertToFullEntity(user: users): Promise<UserEntity> {
    return UserMapper.toDomain(
      user,
      await FactoryRepos.getOrganizationRepository().getAll(user.user_id),
      await this.getViewedList(user.user_id),
      await this.getFavoriteList(user.user_id),
    )
  }
}
