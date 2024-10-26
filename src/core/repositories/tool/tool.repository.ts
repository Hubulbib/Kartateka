import { ToolEntity } from '../../entities/tool.entity.js'
import { CreateBodyDto } from './dtos/create-body.dto.js'

export interface ToolRepository {
  getAll: (organizationId: number) => Promise<ToolEntity[]>
  createOne: (organizationId: number, createBody: CreateBodyDto) => Promise<ToolEntity>
  createMany: (organizationId: number, createBody: CreateBodyDto[]) => Promise<ToolEntity[]>
  editMany: (organizationId: number, editBody: CreateBodyDto[]) => Promise<void>
  removeOne: (toolId: number) => Promise<void>
  removeMany: (organizationId: number) => Promise<void>
}
