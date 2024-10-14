import express from 'express'
import cors from 'cors'
import { serve, setup } from 'swagger-ui-express'
import YAML from 'yamljs'
import 'dotenv/config.js'
import { prisma } from './infrastructure/db'
import { userRouter } from './infrastructure/routers/user.router'
import { postRouter } from './infrastructure/routers/post.router'
import { organizationRouter } from './infrastructure/routers/organization.router'
import { itemRouter } from './infrastructure/routers/item.router'
import { docsPath } from './infrastructure/docs'
import { cacheClient } from './infrastructure/cache'
import { WS } from './infrastructure/ws'
import { createServer } from 'http'

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
