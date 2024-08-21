import { PostRepository } from '../repositories/post/post.repository'
import { EditBodyDto } from '../repositories/post/dtos/edit-body.dto'
import { CreateBodyDto } from '../repositories/post/dtos/create-body.dto'
import { PostEntity } from '../entities/post.entity'

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getOneById = async (postId: number): Promise<PostEntity> => {
    return await this.postRepository.getOneById(postId)
  }

  createOne = async (organizationId: number, createBody: CreateBodyDto): Promise<PostEntity> => {
    return await this.postRepository.createOne(organizationId, createBody)
  }

  setViewed = async (userId: string, postId: number) => {
    return await this.postRepository.setViewed(postId, userId)
  }

  editOne = async (userId: string, postId: number, editBody: EditBodyDto): Promise<void> => {
    await this.postRepository.editOne(userId, postId, editBody)
  }

  removeOne = async (userId: string, postId: number): Promise<void> => {
    await this.postRepository.removeOne(userId, postId)
  }
}
