import { CreateBodyDto } from './dtos/create-body.dto.js'
import { EditBodyDto } from './dtos/edit-body.dto.js'
import { PostEntity, type PostEntityShort } from '../../entities/post.entity.js'

export interface PostRepository {
  getAll: (organizationId: number) => Promise<PostEntity[]>
  getOneById: (postId: number) => Promise<PostEntity>
  getRecommended: (viewed: number[], limit: number) => Promise<PostEntityShort[]>
  searchByText: (queryText: string) => Promise<PostEntityShort[]>
  createOne: (organizationId: number, createBody: CreateBodyDto) => Promise<PostEntity>
  setViewed: (postId: number, userId: string) => Promise<void>
  editOne: (postId: number, editBody: EditBodyDto) => Promise<void>
  removeOne: (postId: number) => Promise<void>
  removeMany: (organizationId: number) => Promise<void>
  checkAccess: (userId: string, postId: number) => Promise<void>
}
