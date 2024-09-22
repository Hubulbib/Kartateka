import { UploadedFile } from 'express-fileupload'
import { createReadStream, unlinkSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { StorageRepository } from '../../../core/repositories/storage/storage.repository'
import { genUuid } from '../../utils/generate.util'
import { BUCKET_NAME, storage, STORAGE_BASE } from '../index'

export class StorageRepositoryImpl implements StorageRepository {
  async uploadFile(file: UploadedFile): Promise<string> {
    const [filePath, fileId] = this.getPathFile(file.name.split('.').pop())
    await file.mv(filePath)

    const fileStream = createReadStream(filePath)
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileId,
      Body: fileStream,
      ContentType: file.mimetype,
    }

    await storage.putObject(params)
    unlinkSync(filePath)
    return this.getPathFileOnStorage(params.Bucket, params.Key)
  }

  private getPathFile(fileExt: string): [string, string] {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const filePath = resolve(__dirname, '../', 'static')
    const uuid = genUuid()
    const fileName = filePath + '/' + uuid + '.' + fileExt
    return [fileName, uuid]
  }

  private getPathFileOnStorage(bucketName: string, fileId: string): string {
    return `${STORAGE_BASE}/${bucketName}/${fileId}`
  }
}