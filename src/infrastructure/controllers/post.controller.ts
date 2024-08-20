import { NextFunction, Request, Response } from 'express'
import { prisma } from '../db'
import { PostService } from '../../core/services/post.service'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { PostRepositoryImpl } from '../db/repositories/post.repository.impl'

class PostController {
  constructor(private readonly postService: PostService) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const organizationData = await this.postService.getAll(+id)
      res.status(201).json({ data: { ...organizationData } })
    } catch (err) {
      next(err)
    }
  }

  async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const organizationData = await this.postService.getOneById(+id)
      res.status(201).json({ data: { ...organizationData } })
    } catch (err) {
      next(err)
    }
  }

  async createOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const createBody = req.body
      const organizationData = await this.postService.createOne(+id, createBody)
      res.status(201).json({ data: { ...organizationData } })
    } catch (err) {
      next(err)
    }
  }

  async editOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const editBody = req.body
      const { uuid } = req.auth.user
      await this.postService.editOne(uuid, +id, editBody)
      res.status(200)
    } catch (err) {
      next(err)
    }
  }

  async removeOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { uuid } = req.auth.user
      await this.postService.removeOne(uuid, +id)
      res.status(200)
    } catch (err) {
      next(err)
    }
  }
}

export const postController = new PostController(
  new PostService(new PostRepositoryImpl(prisma.posts, prisma.posts_tags, prisma.views, prisma.media, prisma.tags)),
)
