import { prisma } from '../index'
import { RepositoryFactory } from './factory.repository.index'

export const FactoryRepos = new RepositoryFactory(
  prisma.users,
  prisma.organizations,
  prisma.tools,
  prisma.media,
  prisma.posts,
  prisma.posts_tags,
  prisma.tags,
  prisma.views,
  prisma.favorites,
  prisma.items,
  prisma.volumes,
)
