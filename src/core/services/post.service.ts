import { type UploadedFile } from 'express-fileupload'
import { PostRepository } from '../repositories/post/post.repository'
import { EditBodyDto } from '../repositories/post/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/post/dtos/create-body.dto'
import { PostEntity } from '../entities/post.entity'
import { StorageService } from './storage.service'
import { StorageRepository } from '../repositories/storage/storage.repository'

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly storageRepository: StorageRepository,
  ) {}

  getOneById = async (postId: number): Promise<PostEntity> => {
    return await this.postRepository.getOneById(postId)
  }

  createOne = async (
    organizationId: number,
    createBody: CreateBodyDto,
    files?: UploadedFile[],
  ): Promise<PostEntity> => {
    const filesUrl: [string, string][] = await this.uploadFiles(Object.values(files))

    return await this.postRepository.createOne(organizationId, {
      ...createBody,
      media: filesUrl.map((el: [string, string]) => ({ url: el[0], type: el[1] })),
    })
  }

  setViewed = async (userId: string, postId: number) => {
    return await this.postRepository.setViewed(postId, userId)
  }

  editOne = async (userId: string, postId: number, editBody: EditBodyDto, files?: UploadedFile[]): Promise<void> => {
    await this.postRepository.checkAccess(userId, postId)
    const filesUrl: [string, string][] = await this.uploadFiles(Object.values(files))
    await this.postRepository.editOne(postId, {
      ...editBody,
      media: filesUrl.map((el: [string, string]) => ({ url: el[0], type: el[1] })),
    })
  }

  removeOne = async (userId: string, postId: number): Promise<void> => {
    await this.postRepository.checkAccess(userId, postId)
    await this.postRepository.removeOne(postId)
  }

  private uploadFiles = async (files: UploadedFile[]): Promise<[string, string][]> => {
    return await Promise.all(
      files.map(
        async (el: UploadedFile): Promise<[string, string]> =>
          await new StorageService(this.storageRepository).uploadFile(el),
      ),
    )
  }
}
