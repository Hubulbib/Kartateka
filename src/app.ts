import express from 'express'
import 'dotenv/config.js'
import cors from 'cors'
import { prisma } from './infrastructure/db'
import { userRouter } from './infrastructure/routers/user.router'
import { postRouter } from './infrastructure/routers/post.router'
import { organizationRouter } from './infrastructure/routers/organization.router'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN_URL,
  }),
)

// API
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/organizations', organizationRouter)

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
  .emit('close', async () => {
    await prisma.$disconnect()
  })
