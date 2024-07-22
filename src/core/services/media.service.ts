import { MediaRepository } from '../repositories/media/media.repository'
import { MediaEntity } from '../entities/media.entity'
import { CreateBodyDto } from '../repositories/media/dtos/create-body.dto'

export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  getAll = async (postId: number): Promise<MediaEntity[]> => {
    return await this.mediaRepository.getAll(postId)
  }

  createOne = async (postId: number, createBody: CreateBodyDto): Promise<MediaEntity> => {
    return await this.mediaRepository.createOne(postId, createBody)
  }

  removeOne = async (postId: number): Promise<void> => {
    await this.mediaRepository.removeOne(postId)
  }
}
