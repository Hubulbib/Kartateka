export interface VolumeRepository {
  getAll: (itemId: number) => Promise<string[]>
  createMany: (itemId: number, volumes: string[]) => Promise<string[]>
  deleteMany: (itemId: number) => Promise<void>
}
