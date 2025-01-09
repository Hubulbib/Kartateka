import { type UploadedFile } from 'express-fileupload'
import { PostRepository } from '../repositories/post/post.repository'
import { EditBodyDto } from '../repositories/post/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/post/dtos/create-body.dto'
import { PostEntity, type PostEntityShort } from '../entities/post.entity'
import { StorageService } from './storage.service'
import { ApiError } from '../../infrastructure/exceptions/api.exception'
import { UserRepository } from '../repositories/user/user.repository'
import { ViewRepository } from '../repositories/view/view.repository'
import { CacheRepository } from '../repositories/cache/cache.repository'

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly viewRepository: ViewRepository,
    private readonly storageService: StorageService,
    private readonly cacheRepository: CacheRepository,
  ) {}

  getOneById = async (postId: number): Promise<PostEntity> => {
    return await this.postRepository.getOneById(postId)
  }

  getRecommended = async (userId: string, limit: number): Promise<PostEntityShort[]> => {
    const cacheKey = this.cacheRepository.createKeyName('user', userId, 'post_recommended')
    const cachePosts = await this.cacheRepository.get<PostEntityShort[]>(cacheKey)
    if (cachePosts) {
      return cachePosts
    }
    const user = await this.userRepository.getOneById(userId)
    const views = await this.viewRepository.getByUser(user.userId)
    const recommended = await this.postRepository.getRecommended(
      views.map((el) => el.postId),
      limit | 10,
    )
    await this.cacheRepository.set<PostEntityShort[]>(cacheKey, recommended, 3600)
    return recommended
  }

  createOne = async (
    userId: string,
    organizationId: number,
    createBody: Omit<CreateBodyDto, 'media'>,
    files?: UploadedFile[],
  ): Promise<PostEntity> => {
    if (!(await this.checkAccess(userId))) {
      //throw ApiError.NotAccess()
    }
    const filesUrl: [string, string][] = await this.uploadFiles(Object.values(files))
    let i = 1 // number of media
    return await this.postRepository.createOne(organizationId, {
      ...createBody,
      media: filesUrl.map((el: [string, string]) => ({ url: el[0], type: el[1], number: i++ })),
    })
  }

  setViewed = async (userId: string, postId: number) => {
    return await this.postRepository.setViewed(postId, userId)
  }

  editOne = async (userId: string, postId: number, editBody: EditBodyDto, files?: UploadedFile[]): Promise<void> => {
    if (!(await this.checkAccess(userId))) {
      //throw ApiError.NotAccess()
    }
    await this.postRepository.checkAccess(userId, postId)
    const filesUrl: [string, string][] = await this.uploadFiles(Object.values(files))
    let i = 1 // number of media
    await this.postRepository.editOne(postId, {
      ...editBody,
      media: filesUrl.map((el: [string, string]) => ({ url: el[0], type: el[1], number: i++ })),
    })
  }

  removeOne = async (userId: string, postId: number): Promise<void> => {
    if (!(await this.checkAccess(userId))) {
      //throw ApiError.NotAccess()
    }
    await this.postRepository.checkAccess(userId, postId)
    await this.postRepository.removeOne(postId)
  }

  private uploadFiles = async (files: UploadedFile[]): Promise<[string, string][]> => {
    return await Promise.all(
      files.map(async (el: UploadedFile): Promise<[string, string]> => await this.storageService.uploadFile(el)),
    )
  }

  private checkAccess = async (userId: string): Promise<boolean> => {
    return ['business', 'admin'].includes(await this.userRepository.getType(userId))
  }
}
