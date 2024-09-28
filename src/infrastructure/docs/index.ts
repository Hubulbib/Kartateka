import { fileURLToPath } from 'node:url'
import { dirname, join } from 'path'

export const docsPath = join(dirname(fileURLToPath(import.meta.url)), 'openapi.yaml')