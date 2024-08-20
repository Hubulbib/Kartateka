import { posts, Prisma } from '@prisma/client'
import { PostRepository } from '../../../core/repositories/post/post.repository'
import { PostEntity } from '../../../core/entities/post.entity'
import { CreateBodyDto } from '../../../core/repositories/post/dtos/create-body.dto'
import { EditBodyDto } from '../../../core/repositories/post/dtos/edit-body.dto'
import { MediaRepositoryImpl } from './media.repository.impl'
import { ViewRepository } from './view.repository'
import { TagRepository } from './tag.repository'
import { PostMapper } from '../mappers/post.mapper'
import { PostTagRepository } from './post-tag.repository'
import { ApiError } from '../../exceptions/api.exception'

export class PostRepositoryImpl implements PostRepository {
  constructor(
    private readonly postRepository: Prisma.postsDelegate,
    private readonly postsTagsRepository: Prisma.posts_tagsDelegate,
    private readonly viewRepository: Prisma.viewsDelegate,
    private readonly mediaRepository: Prisma.mediaDelegate,
    private readonly tagRepository: Prisma.tagsDelegate,
  ) {}
  async getAll(organizationId: number): Promise<PostEntity[]> {
    const posts = await this.postRepository.findMany({
      where: { organization_id: organizationId },
      include: { posts_tags: { include: { tags: true } } },
      orderBy: { created_at: 'desc' },
    })
    return Promise.all(posts.map(async (el) => await this.convertToFullEntity(el)))
  }

  async getOneById(postId: number): Promise<PostEntity> {
    const post = await this.postRepository.findFirst({
      where: { post_id: postId },
      include: { posts_tags: { include: { tags: true } } },
      orderBy: { created_at: 'desc' },
    })
    if (!post) {
      throw Error('Такого поста не существует')
    }
    return await this.convertToFullEntity(post)
  }

  async createOne(organizationId: number, createBody: CreateBodyDto): Promise<PostEntity> {
    const { media, tags, ...postCreateBody } = createBody
    // creating post
    const post = await this.postRepository.create({
      data: { ...postCreateBody, organizations: { connect: { organization_id: organizationId } } },
    })
    // creating tags of post
    const createdTags = await new TagRepository(this.tagRepository, this.postsTagsRepository).createManyForPost(
      post.post_id,
      createBody.tags,
    )
    // creating media of post
    await new MediaRepositoryImpl(this.mediaRepository).createMany(post.post_id, media)

    return await this.convertToFullEntity({ ...post, posts_tags: [...createdTags.map((el) => ({ tags: { ...el } }))] })
  }

  async setViewed(postId: number, userId: string): Promise<void> {
    await new ViewRepository(this.viewRepository).setViewed(postId, userId)
  }

  async editOne(userId: string, postId: number, editBody: EditBodyDto): Promise<void> {
    await this.checkAccess(userId, postId)
    const { media, tags, ...postEditBody } = editBody
    // updating post
    await this.postRepository.update({ where: { post_id: postId }, data: { ...postEditBody, updated_at: new Date() } })
    // updating tags
    await new TagRepository(this.tagRepository, this.postsTagsRepository).editMany(postId, tags)
    // updating media
    await new MediaRepositoryImpl(this.mediaRepository).editMany(postId, media)
  }

  async removeOne(userId: string, postId: number): Promise<void> {
    await this.checkAccess(userId, postId)
    await new PostTagRepository(this.postsTagsRepository).removeManyOfPost(postId)
    await new MediaRepositoryImpl(this.mediaRepository).removeMany(postId)
    await this.postRepository.delete({ where: { post_id: postId } })
  }

  async removeMany(userId: string, organizationId: number): Promise<void> {
    const posts = await this.postRepository.findMany({ where: { organization_id: organizationId } })
    for (const el of posts) {
      await this.removeOne(userId, el.post_id)
    }
  }

  private async convertToFullEntity(
    post: posts & { posts_tags: { tags: { tag_id: number; name: string } }[] },
  ): Promise<PostEntity> {
    return PostMapper.toDomain(
      post,
      await new ViewRepository(this.viewRepository).getCount(post.post_id),
      post.posts_tags.map((el) => el.tags.name),
      await new MediaRepositoryImpl(this.mediaRepository).getAll(post.post_id),
    )
  }

  private async checkAccess(userId: string, postId: number) {
    const user = await this.postRepository
      .findFirst({ where: { post_id: postId } })
      .organizations()
      .users()
    if (user.user_id !== userId) {
      throw ApiError.NotAccess('Это не ваша запись')
    }
  }
}
