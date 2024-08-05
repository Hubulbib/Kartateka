import { mediatype, Prisma } from '@prisma/client'
import { MediaRepository } from '../../../core/repositories/media/media.repository'
import { CreateBodyDto } from '../../../core/repositories/media/dtos/create-body.dto'
import { MediaEntity } from '../../../core/entities/media.entity'
import { MediaMapper } from '../mappers/media.mapper'

export class MediaRepositoryImpl implements MediaRepository {
  constructor(private readonly mediaRepository: Prisma.mediaDelegate) {}

  async getAll(postId: number): Promise<MediaEntity[]> {
    const media = await this.mediaRepository.findMany({ where: { post_id: postId }, orderBy: { created_at: 'desc' } })
    return media.map((el) => MediaMapper.toDomain(el))
  }

  async createOne(postId: number, createBody: CreateBodyDto): Promise<MediaEntity> {
    return MediaMapper.toDomain(
      await this.mediaRepository.create({
        data: {
          ...createBody,
          type: mediatype[createBody.type],
          posts: { connect: { post_id: postId } },
        },
      }),
    )
  }

  async createMany(postId: number, createBody: CreateBodyDto[]): Promise<MediaEntity[]> {
    const media = await this.mediaRepository.createManyAndReturn({
      data: [
        ...createBody.map((el) => ({
          ...el,
          type: mediatype[el.type] ? mediatype[el.type] : mediatype.image,
          post_id: postId,
        })),
      ],
      skipDuplicates: true,
    })
    return media.map((el) => MediaMapper.toDomain(el))
  }

  async editMany(postId: number, editBody: CreateBodyDto[]): Promise<void> {
    await this.removeMany(postId)
    await this.createMany(postId, editBody)
  }

  async removeMany(postId: number): Promise<void> {
    await this.mediaRepository.deleteMany({ where: { post_id: postId } })
  }
}
