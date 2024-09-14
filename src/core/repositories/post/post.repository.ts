import { CreateBodyDto } from './dtos/create-body.dto'
import { EditBodyDto } from './dtos/edit-body.dto'
import { PostEntity } from '../../entities/post.entity'

export interface PostRepository {
  getAll: (organizationId: number) => Promise<PostEntity[]>
  getOneById: (postId: number) => Promise<PostEntity>
  createOne: (organizationId: number, createBody: CreateBodyDto) => Promise<PostEntity>
  setViewed: (postId: number, userId: string) => Promise<void>
  editOne: (postId: number, editBody: EditBodyDto) => Promise<void>
  removeOne: (postId: number) => Promise<void>
  removeMany: (organizationId: number) => Promise<void>
  checkAccess: (userId: string, postId: number) => Promise<void>
}
