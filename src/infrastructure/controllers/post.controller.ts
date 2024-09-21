import { NextFunction, Request, Response } from 'express'
import { PostService } from '../../core/services/post.service'
import { IAuthRequest } from '../interfaces/auth.request.interface'
import { FactoryRepos } from '../db/repositories'
import { StorageRepositoryImpl } from '../storage/repositories/storage.repository.impl'

class PostController {
  constructor(private readonly postService: PostService) {}

  async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const postData = await this.postService.getOneById(+id)
      res.status(201).json({ data: { ...postData } })
    } catch (err) {
      next(err)
    }
  }

  async createOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const createBody = req.body
      const { media } = req.files
      const postData = await this.postService.createOne(+id, createBody, Array.isArray(media) ? [...media] : [media])
      res.status(201).json({ data: { ...postData } })
    } catch (err) {
      next(err)
    }
  }

  async setViewed(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { uuid } = req.auth.user
      await this.postService.setViewed(uuid, +id)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  async editOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { uuid } = req.auth.user
      const editBody = req.body
      const { media } = req.files
      await this.postService.editOne(uuid, +id, editBody, Array.isArray(media) ? [...media] : [media])
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  async removeOne(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { uuid } = req.auth.user
      await this.postService.removeOne(uuid, +id)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
}

export const postController = new PostController(
  new PostService(FactoryRepos.getPostRepository(), new StorageRepositoryImpl()),
)
