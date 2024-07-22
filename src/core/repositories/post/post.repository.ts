import { CreateBodyDto } from './dtos/create-body.dto'
import { EditBodyDto } from './dtos/edit-body.dto'
import { PostEntity } from '../../entities/post.entity'

export interface PostRepository {
  getAll: (organizationId: number) => Promise<PostEntity[]>
  getOneById: (postId: number) => Promise<PostEntity>
  createOne: (organizationId: number, createBody: CreateBodyDto) => Promise<PostEntity>
  editOne: (postId: number, editBody: EditBodyDto) => Promise<void>
  removeOne: (postId: number) => Promise<void>
}
