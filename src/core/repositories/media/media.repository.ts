import { MediaEntity } from '../../entities/media.entity'
import { CreateBodyDto } from './dtos/create-body.dto'

export interface MediaRepository {
  getAll: (postId: number) => Promise<MediaEntity[]>
  createOne: (postId: number, createBody: CreateBodyDto) => Promise<MediaEntity>
  removeOne: (postId: number) => Promise<void>
}
