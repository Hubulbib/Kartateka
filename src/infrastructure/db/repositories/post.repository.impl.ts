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

  async getRecommended(viewed: number[], limit: number): Promise<Pick<PostEntity, 'postId' | 'media'>[]> {
    const allPosts = await this.postRepository.findMany({ select: { post_id: true } })

    // Ранжируем посты
    const rankedPosts = allPosts.map((post) => this.rankingPost(post.post_id, viewed))

    // Сортируем посты по убыванию оценки
    rankedPosts.sort((a, b) => b.score - a.score)

    return await Promise.all(
      rankedPosts.slice(0, limit).map(async (el) => ({
        postId: el.postId,
        media: await FactoryRepos.getMediaRepository().getAll(el.postId),
      })),
    )
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

  private rankingPost(postId: number, viewed: number[]) {
    let score = 0

    // Увеличиваем оценку, если пост был просмотрен пользователем
    if (viewed.includes(postId)) {
      score += 5 // Вес для просмотренных постов
    }

    return { postId, score } // Возвращаем пост с его оценкой
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
