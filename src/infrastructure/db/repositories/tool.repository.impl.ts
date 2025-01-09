import { Prisma } from '@prisma/client'
import { ToolMapper } from '../mappers/tool.mapper'
import { ToolEntity } from '../../../core/entities/tool.entity'
import { ToolRepository } from '../../../core/repositories/tool/tool.repository'
import { CreateBodyDto } from '../../../core/repositories/tool/dtos/create-body.dto'

export class ToolRepositoryImpl implements ToolRepository {
  constructor(private readonly toolRepository: Prisma.toolsDelegate) {}

  async getAll(organizationId: number): Promise<ToolEntity[]> {
    return (await this.toolRepository.findMany({ where: { organization_id: organizationId } })).map((el) =>
      ToolMapper.toDomain(el),
    )
  }

  async createOne(organizationId: number, createBody: CreateBodyDto): Promise<ToolEntity> {
    const existTool = await this.toolRepository.findFirst({ where: { name: createBody.name } })
    if (existTool) {
      throw Error('Данный инструмент уже существует')
    }
    const newTool = await this.toolRepository.create({
      data: { ...createBody, organizations: { connect: { organization_id: organizationId } } },
    })
    return ToolMapper.toDomain(newTool)
  }

  async createMany(organizationId: number, createBody: CreateBodyDto[]): Promise<ToolEntity[]> {
    const tools = await this.toolRepository.createManyAndReturn({
      data: [...createBody.map((el) => ({ organization_id: organizationId, ...el }))],
    })
    return tools.map((el) => ToolMapper.toDomain(el))
  }

  async editMany(organizationId: number, editBody: CreateBodyDto[]): Promise<void> {
    await this.removeMany(organizationId)
    await this.createMany(organizationId, editBody)
  }

  async removeOne(toolId: number): Promise<void> {
    await this.toolRepository.delete({ where: { tool_id: toolId } })
  }

  async removeMany(organizationId: number): Promise<void> {
    await this.toolRepository.deleteMany({ where: { organization_id: organizationId } })
  }
}
