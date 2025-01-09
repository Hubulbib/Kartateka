import { beforeEach, describe, expect, it } from '@jest/globals'
import { prismaMock } from '../index'
import { UserService } from '../../src/core/services/user.service'
import { RegisterBodyDto } from '../../src/core/repositories/user/dtos/register-body.dto'
import { EUserType } from '../../src/core/entities/user.entity'
import { organizations, users } from '@prisma/client'
import { FactoryRepos } from '../../src/infrastructure/db/repositories'
import { UserRepository } from '../../src/core/repositories/user/user.repository'
import { EOrganizationType } from '../../src/core/entities/organization.entity'
import { ViewRepository } from '../../src/core/repositories/view/view.repository'
import { FavoriteRepository } from '../../src/core/repositories/favorite/favorite.repository'
import { OrganizationRepository } from '../../src/core/repositories/organization/organization.repository'
import { PostRepository } from '../../src/core/repositories/post/post.repository'
import { CacheRepository } from '../../src/core/repositories/cache/cache.repository'

describe('UserService', () => {
  let userService: UserService
  let userPrismaRepository: UserRepository
  let viewPrismaRepository: ViewRepository
  let favoritePrismaRepository: FavoriteRepository
  let organizationPrismaRepository: OrganizationRepository
  let postPrismaRepository: PostRepository
  let cacheRepository: CacheRepository

  beforeEach(() => {
    userPrismaRepository = FactoryRepos.getUserRepository()
    userService = new UserService(
      userPrismaRepository,
      viewPrismaRepository,
      favoritePrismaRepository,
      organizationPrismaRepository,
      postPrismaRepository,
      cacheRepository,
    )
  })

  it('it should register user', async () => {
    const registerBody: RegisterBodyDto = { userId: '1' }
    const mockUser: users = { user_id: '1', type: EUserType.basic }

    prismaMock.users.create.mockResolvedValue(mockUser)

    const result = await userService.register(registerBody)

    expect(prismaMock.users.create).toHaveBeenCalledWith({ data: { user_id: registerBody.userId } })
    const { user_id, ...user } = mockUser
    expect(result).toEqual({ ...user, favorites: [], organizations: [], userId: user_id, views: [] })
  })

  it('it should get user by id', async () => {
    const userId: string = '1'
    const mockUser: users = { user_id: '1', type: EUserType.basic }

    prismaMock.users.findFirst.mockResolvedValue(mockUser)

    const result = await userService.getOne(userId)

    expect(prismaMock.users.findFirst).toHaveBeenCalledWith({ where: { user_id: userId } })
    const { user_id, ...user } = mockUser
    expect(result).toEqual({ ...user, favorites: [], organizations: [], userId: user_id, views: [] })
  })
})
