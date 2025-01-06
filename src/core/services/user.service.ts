import { UserRepository } from '../repositories/user/user.repository.js'
import { EUserType, UserEntity, UserEntityShort } from '../entities/user.entity.js'
import { OrganizationEntity } from '../entities/organization.entity.js'
import { PostEntity } from '../entities/post.entity.js'
import { RegisterBodyDto } from '../repositories/user/dtos/register-body.dto.js'
import { ViewRepository } from '../repositories/view/view.repository.js'
import { FavoriteRepository } from '../repositories/favorite/favorite.repository.js'
import { OrganizationRepository } from '../repositories/organization/organization.repository.js'
import { PostRepository } from '../repositories/post/post.repository.js'
import { CacheRepository } from '../repositories/cache/cache.repository.js'

export class UserService {
  constructor(
    readonly userRepository: UserRepository,
    readonly viewRepository: ViewRepository,
    readonly favoriteRepository: FavoriteRepository,
    readonly organizationRepository: OrganizationRepository,
    readonly postRepository: PostRepository,
    readonly cacheRepository: CacheRepository,
  ) {}

  register = async (registerBody: RegisterBodyDto): Promise<UserEntity> => {
    return {
      ...(await this.userRepository.register(registerBody)),
      organizations: [],
      views: [],
      favorites: [],
    }
  }

  /*getSubscribe = async (userId: string): Promise<void> => {
    await this.userRepository.getSubscribe(userId)
  }*/

  getOneById = async (userId: string): Promise<UserEntity> => {
    const cacheKey = this.cacheRepository.createKeyName('user', userId)
    let user = await this.cacheRepository.get<UserEntityShort>(cacheKey)
    if (!user) {
      user = await this.userRepository.getOneById(userId)
      await this.cacheRepository.set<UserEntityShort>(cacheKey, user, 1200)
    }
    return {
      ...user,
      ...(await this.getFullUser(user.userId)),
    }
  }

  getFavoriteList = async (userId: string): Promise<OrganizationEntity[]> => {
    return await this.userRepository.getFavoriteList(userId)
  }
  getViewedList = async (userId: string): Promise<PostEntity[]> => {
    return await this.userRepository.getViewedList(userId)
  }
  getType = async (userId: string): Promise<EUserType> => {
    const type = await this.userRepository.getType(userId)
    return EUserType[type] || EUserType.basic
  }

  private getFullUser = async (
    userId: string,
  ): Promise<{ organizations: OrganizationEntity[]; views: PostEntity[]; favorites: OrganizationEntity[] }> => {
    const organizations = await this.organizationRepository.getAll(userId)

    const viewList = await this.viewRepository.getByUser(userId)
    const views = await Promise.all(viewList.map(async (el) => await this.postRepository.getOneById(el.postId)))

    const favoriteList = await this.favoriteRepository.getAll(userId)
    const favorites = await Promise.all(
      favoriteList.map(async (el) => await this.organizationRepository.getOneById(el.organizationId)),
    )

    return { organizations, views, favorites }
  }
}
