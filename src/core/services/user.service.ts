import { UserRepository } from '../repositories/user/user.repository'
import { EUserType, UserEntity, UserEntityShort } from '../entities/user.entity'
import { OrganizationEntity } from '../entities/organization.entity'
import { PostEntity } from '../entities/post.entity'
import { RegisterBodyDto } from '../repositories/user/dtos/register-body.dto'
import { ViewRepository } from '../repositories/view/view.repository'
import { FavoriteRepository } from '../repositories/favorite/favorite.repository'
import { OrganizationRepository } from '../repositories/organization/organization.repository'
import { PostRepository } from '../repositories/post/post.repository'
import { CacheRepository } from '../repositories/cache/cache.repository'

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

  getOne = async (userId: string): Promise<UserEntity> => {
    const user = await this.userRepository.getOneById(userId)

    return {
      ...user,
      favorites: [],
      organizations: [],
      views: [],
    }
  }

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
