import { type UploadedFile } from 'express-fileupload'
import { PostRepository } from '../repositories/post/post.repository'
import { EditBodyDto } from '../repositories/post/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/post/dtos/create-body.dto'
import { PostEntity } from '../entities/post.entity'
import { StorageService } from './storage.service'
import { UserService } from './user.service'
import { ApiError } from '../../infrastructure/exceptions/api.exception'

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly storageService: StorageService,
    private readonly userService: UserService,
  ) {}

  getOneById = async (postId: number): Promise<PostEntity> => {
    return await this.postRepository.getOneById(postId)
  }

  getRecommended = async (userId: string, limit: number): Promise<Pick<PostEntity, 'postId' | 'media'>[]> => {
    const user = await this.userService.getOneById(userId)
    return await this.postRepository.getRecommended(
      user.views.map((el) => el.postId),
      limit | 10,
    )
  }

  createOne = async (
    userId: string,
    organizationId: number,
    createBody: CreateBodyDto,
    files?: UploadedFile[],
  ): Promise<PostEntity> => {
    if (!(await this.checkAccess(userId))) {
      throw ApiError.NotAccess()
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
      throw ApiError.NotAccess()
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
      throw ApiError.NotAccess()
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
    return ['business', 'admin'].includes(await this.userService.getType(userId))
  }
}
