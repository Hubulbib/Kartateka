import express from 'express'
import cors from 'cors'
import { serve, setup } from 'swagger-ui-express'
import { createServer } from 'http'
import YAML from 'yamljs'
import 'dotenv/config.js'

import { prisma } from './infrastructure/db/index.js'
import { userRouter } from './infrastructure/routers/user.router.js'
import { postRouter } from './infrastructure/routers/post.router.js'
import { organizationRouter } from './infrastructure/routers/organization.router.js'
import { itemRouter } from './infrastructure/routers/item.router.js'
import { docsPath } from './infrastructure/docs/index.js'
import { cacheClient } from './infrastructure/cache/index.js'
import { WS } from './infrastructure/ws/index.js'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN_URL,
  }),
)

// API DOCS
app.use('/api/docs', serve, setup(YAML.load(docsPath)))
// API
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/org', organizationRouter)
app.use('/api/org-item', itemRouter)

const server = createServer(app)
const ws = new WS(server)

server
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
  .emit('close', async () => {
    await prisma.$disconnect()
    await cacheClient.disconnect()
    ws.close()
  })
