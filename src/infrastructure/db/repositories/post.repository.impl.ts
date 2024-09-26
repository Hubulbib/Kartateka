import { posts, Prisma } from '@prisma/client'
import { PostRepository } from '../../../core/repositories/post/post.repository'
import { PostEntity } from '../../../core/entities/post.entity'
import { CreateBodyDto } from '../../../core/repositories/post/dtos/create-body.dto'
import { EditBodyDto } from '../../../core/repositories/post/dtos/edit-body.dto'
import { PostMapper } from '../mappers/post.mapper'
import { ApiError } from '../../exceptions/api.exception'
import { FactoryRepos } from './index'

export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly postRepository: Prisma.postsDelegate) {}
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
    const createdTags = await FactoryRepos.getTagRepository().createManyForPost(post.post_id, createBody.tags)
    // creating media of post
    await FactoryRepos.getMediaRepository().createMany(post.post_id, media)

    return await this.convertToFullEntity({ ...post, posts_tags: [...createdTags.map((el) => ({ tags: { ...el } }))] })
  }

  async setViewed(postId: number, userId: string): Promise<void> {
    await FactoryRepos.getViewRepository().setViewed(postId, userId)
  }

  async editOne(postId: number, editBody: EditBodyDto): Promise<void> {
    const { media, tags, ...postEditBody } = editBody
    // updating post
    await this.postRepository.update({ where: { post_id: postId }, data: { ...postEditBody, updated_at: new Date() } })
    // updating tags
    await FactoryRepos.getTagRepository().editMany(postId, tags)
    // updating media
    await FactoryRepos.getMediaRepository().editMany(postId, media)
  }

  async removeOne(postId: number): Promise<void> {
    await FactoryRepos.getPostsTagsRepository().removeManyOfPost(postId)
    await FactoryRepos.getMediaRepository().removeMany(postId)
    await this.postRepository.delete({ where: { post_id: postId } })
  }

  async removeMany(organizationId: number): Promise<void> {
    const posts = await this.postRepository.findMany({ where: { organization_id: organizationId } })
    for (const el of posts) {
      await this.removeOne(el.post_id)
    }
  }

  private async convertToFullEntity(
    post: posts & { posts_tags: { tags: { tag_id: number; name: string } }[] },
  ): Promise<PostEntity> {
    return PostMapper.toDomain(
      post,
      await FactoryRepos.getViewRepository().getCount(post.post_id),
      post.posts_tags.map((el) => el.tags.name),
      await FactoryRepos.getMediaRepository().getAll(post.post_id),
    )
  }

  async checkAccess(userId: string, postId: number): Promise<void> {
    const user = await this.postRepository
      .findFirst({ where: { post_id: postId } })
      .organizations()
      .users()

    if (user.user_id !== userId) {
      throw ApiError.NotAccess('Это не ваша запись')
    }
  }
}
