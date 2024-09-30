import { S3 } from '@aws-sdk/client-s3'

const storage = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  endpoint: process.env.AWS_CLIENT,
  forcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME
const STORAGE_BASE = process.env.AWS_CLIENT

export { storage, BUCKET_NAME, STORAGE_BASE }
