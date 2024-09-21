import { UploadedFile } from 'express-fileupload'

export interface StorageRepository {
  uploadFile: (file: UploadedFile) => Promise<string>
}
