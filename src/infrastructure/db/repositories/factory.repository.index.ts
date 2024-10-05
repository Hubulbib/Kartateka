import { Prisma } from '@prisma/client'
import { UserRepositoryImpl } from './user.repository.impl'
import { OrganizationRepositoryImpl } from './organization.repository.impl'
import { ToolRepositoryImpl } from './tool.repository.impl'
import { FavoriteRepositoryImpl } from './favorite.repository.impl'
import { PostRepositoryImpl } from './post.repository.impl'
import { MediaRepositoryImpl } from './media.repository.impl'
import { UserRepository } from '../../../core/repositories/user/user.repository'
import { OrganizationRepository } from '../../../core/repositories/organization/organization.repository'
import { ToolRepository } from '../../../core/repositories/tool/tool.repository'
import { PostRepository } from '../../../core/repositories/post/post.repository'
import { MediaRepository } from '../../../core/repositories/media/media.repository'
import { TagRepository } from './tag.repository'
import { PostTagRepository } from './post-tag.repository'
import { ViewRepositoryImpl } from './view.repository.impl'

export class RepositoryFactory {
  constructor(
    private readonly userRepository: Prisma.usersDelegate,
    private readonly organizationRepository: Prisma.organizationsDelegate,
    private readonly toolRepository: Prisma.toolsDelegate,
    private readonly mediaRepository: Prisma.mediaDelegate,
    private readonly postRepository: Prisma.postsDelegate,
    private readonly postsTagsRepository: Prisma.posts_tagsDelegate,
    private readonly tagRepository: Prisma.tagsDelegate,
    private readonly viewRepository: Prisma.viewsDelegate,
    private readonly favoriteRepository: Prisma.favoritesDelegate,
  ) {}

  getUserRepository(): UserRepository {
    return new UserRepositoryImpl(this.userRepository)
  }

  getOrganizationRepository(): OrganizationRepository {
    return new OrganizationRepositoryImpl(this.organizationRepository)
  }

  getToolRepository(): ToolRepository {
    return new ToolRepositoryImpl(this.toolRepository)
  }

  getFavoriteRepository(): FavoriteRepositoryImpl {
    return new FavoriteRepositoryImpl(this.favoriteRepository)
  }

  getPostRepository(): PostRepository {
    return new PostRepositoryImpl(this.postRepository)
  }

  getMediaRepository(): MediaRepository {
    return new MediaRepositoryImpl(this.mediaRepository)
  }

  getTagRepository(): TagRepository {
    return new TagRepository(this.tagRepository)
  }

  getPostsTagsRepository(): PostTagRepository {
    return new PostTagRepository(this.postsTagsRepository)
  }

  getViewRepository(): ViewRepositoryImpl {
    return new ViewRepositoryImpl(this.viewRepository)
  }
}
