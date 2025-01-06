import { Prisma } from '@prisma/client'
import { PostEntity } from '../../../core/entities/post.entity.js'
import { type UserEntityShort } from '../../../core/entities/user.entity.js'
import { OrganizationEntity } from '../../../core/entities/organization.entity.js'
import { UserRepository } from '../../../core/repositories/user/user.repository.js'
import { RegisterBodyDto } from '../../../core/repositories/user/dtos/register-body.dto.js'
import { UserMapper } from '../mappers/user.mapper.js'
import { FactoryRepos } from './index.js'
import { ApiError } from '../../exceptions/api.exception.js'

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userRepository: Prisma.usersDelegate) {}
  async register(registerBody: RegisterBodyDto): Promise<UserEntityShort> {
    const { userId, ...body } = registerBody
    return UserMapper.toDomain(await this.userRepository.create({ data: { ...body, user_id: userId } }))
  }

  /*async getSubscribe(userId: string): Promise<void> {
    await this.userRepository.update({ where: { user_id: userId }, data: { type: 'business' } })
  }*/

  async getOneById(userId: string): Promise<UserEntityShort> {
    const user = await this.userRepository.findFirst({ where: { user_id: userId } })
    if (!user) {
      throw ApiError.NotFound('Пользователь отсутствует')
    }
    return UserMapper.toDomain(user)
  }

  async getFavoriteList(userId: string): Promise<OrganizationEntity[]> {
    const favorites = await FactoryRepos.getFavoriteRepository().getAll(userId)
    if (!favorites) {
      return []
    }
    return Promise.all(
      favorites.map(async (el) => await FactoryRepos.getOrganizationRepository().getOneById(el.organizationId)),
    )
  }

  async getViewedList(userId: string): Promise<PostEntity[]> {
    const views = await FactoryRepos.getViewRepository().getByUser(userId)
    if (!views) {
      return []
    }
    return Promise.all(views.map(async (el) => await FactoryRepos.getPostRepository().getOneById(el.postId)))
  }

  async getType(userId: string): Promise<string> {
    const user = await this.userRepository.findFirst({ where: { user_id: userId } })
    if (!user) {
      throw ApiError.NotFound('Пользователь отсутствует')
    }
    return user.type
  }
}
