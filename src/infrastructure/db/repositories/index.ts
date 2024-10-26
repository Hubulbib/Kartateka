import { prisma } from '../index.js'
import { RepositoryFactory } from './factory.repository.index.js'

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
