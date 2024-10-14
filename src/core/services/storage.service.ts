import { UploadedFile } from 'express-fileupload'
import { StorageRepository } from '../repositories/storage/storage.repository'
import { EMediaType } from '../entities/media.entity'

export class StorageService {
  constructor(private readonly storageRepository: StorageRepository) {}

  uploadFile = async (file: UploadedFile): Promise<[string, string]> => {
    return [await this.storageRepository.uploadFile(file), this.getType(file.mimetype)]
  }

  private getType = (mimetype: string): EMediaType => {
    if (mimetype.includes('gif')) {
      return EMediaType.gif
    } else if (mimetype.includes('image?')) {
      return EMediaType.image
    } else if (mimetype.includes('video')) {
      return EMediaType.video
    }
    return EMediaType.image
  }
}
