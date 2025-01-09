import { tools } from '@prisma/client'
import { ToolEntity } from '../../../core/entities/tool.entity'

export class ToolMapper {
  static toDomain(entity: tools): ToolEntity {
    return new ToolEntity(entity.tool_id, entity.name, entity.content as object, entity.organization_id)
  }
}
