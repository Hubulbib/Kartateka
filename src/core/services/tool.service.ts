import { CreateBodyDto } from '../repositories/tool/dtos/create-body.dto'
import { ToolRepository } from '../repositories/tool/tool.repository'
import { ToolEntity } from '../entities/tool.entity'

export class ToolService {
  constructor(private readonly toolRepository: ToolRepository) {}

  getAll = async (organizationId: number): Promise<ToolEntity[]> => {
    return await this.toolRepository.getAll(organizationId)
  }

  createOne = async (organizationId: number, createBody: CreateBodyDto): Promise<ToolEntity> => {
    return await this.toolRepository.createOne(organizationId, createBody)
  }

  removeOne = async (toolId: number): Promise<void> => {
    await this.toolRepository.removeOne(toolId)
  }
}
