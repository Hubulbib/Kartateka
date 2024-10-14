import { VolumeRepository } from '../../../core/repositories/volume/volume.repository'
import { Prisma } from '@prisma/client'

export class VolumeRepositoryImpl implements VolumeRepository {
  constructor(private readonly volumeRepository: Prisma.volumesDelegate) {}

  async getAll(itemId: number): Promise<string[]> {
    const volumes = await this.volumeRepository.findMany({ where: { item_id: itemId } })
    return volumes.map((el) => el.name)
  }

  async createMany(itemId: number, volumes: string[]): Promise<string[]> {
    await this.volumeRepository.createMany({
      data: [...volumes.map((el) => ({ name: el, item_id: itemId }))],
    })
    return volumes
  }

  async deleteMany(itemId: number): Promise<void> {
    await this.volumeRepository.deleteMany({ where: { item_id: itemId } })
  }
}
