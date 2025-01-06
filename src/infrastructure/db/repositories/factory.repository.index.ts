import { Prisma } from '@prisma/client'
import { UserRepositoryImpl } from './user.repository.impl.js'
import { OrganizationRepositoryImpl } from './organization.repository.impl.js'
import { ToolRepositoryImpl } from './tool.repository.impl.js'
import { FavoriteRepositoryImpl } from './favorite.repository.impl.js'
import { PostRepositoryImpl } from './post.repository.impl.js'
import { MediaRepositoryImpl } from './media.repository.impl.js'
import { UserRepository } from '../../../core/repositories/user/user.repository.js'
import { OrganizationRepository } from '../../../core/repositories/organization/organization.repository.js'
import { ToolRepository } from '../../../core/repositories/tool/tool.repository.js'
import { PostRepository } from '../../../core/repositories/post/post.repository.js'
import { MediaRepository } from '../../../core/repositories/media/media.repository.js'
import { TagRepository } from './tag.repository.js'
import { PostTagRepository } from './post-tag.repository.js'
import { ViewRepositoryImpl } from './view.repository.impl.js'
import { ItemRepositoryImpl } from './item.repository.impl.js'
import { FavoriteRepository } from '../../../core/repositories/favorite/favorite.repository.js'
import { ViewRepository } from '../../../core/repositories/view/view.repository.js'
import { ItemRepository } from '../../../core/repositories/item/item.repository.js'
import { VolumeRepository } from '../../../core/repositories/volume/volume.repository.js'
import { VolumeRepositoryImpl } from './volume.repository.impl.js'

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
    private readonly itemRepository: Prisma.itemsDelegate,
    private readonly volumeRepository: Prisma.volumesDelegate,
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

  getFavoriteRepository(): FavoriteRepository {
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

  getViewRepository(): ViewRepository {
    return new ViewRepositoryImpl(this.viewRepository)
  }

  getItemRepository(): ItemRepository {
    return new ItemRepositoryImpl(this.itemRepository)
  }

  getVolumeRepository(): VolumeRepository {
    return new VolumeRepositoryImpl(this.volumeRepository)
  }
}
