import { ToolEntity } from '../../entities/tool.entity'
import { CreateBodyDto } from './dtos/create-body.dto'

export interface ToolRepository {
  getAll: (organizationId: number) => Promise<ToolEntity[]>
  createOne: (organizationId: number, createBodyDto: CreateBodyDto) => Promise<ToolEntity>
  removeOne: (toolId: number) => Promise<void>
}
