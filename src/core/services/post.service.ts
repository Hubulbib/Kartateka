import { PostRepository } from '../repositories/post/post.repository'
import { EditBodyDto } from '../repositories/post/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/post/dtos/create-body.dto'
import { PostEntity } from '../entities/post.entity'

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAll = async (organizationId: number): Promise<PostEntity[]> => {
    return await this.postRepository.getAll(organizationId)
  }

  getOneById = async (postId: number): Promise<PostEntity> => {
    return await this.postRepository.getOneById(postId)
  }

  createOne = async (organizationId: number, createBody: CreateBodyDto): Promise<PostEntity> => {
    return await this.postRepository.createOne(organizationId, createBody)
  }

  editOne = async (postId: number, editBody: EditBodyDto): Promise<void> => {
    await this.postRepository.editOne(postId, editBody)
  }

  removeOne = async (postId: number): Promise<void> => {
    await this.postRepository.removeOne(postId)
  }
}
