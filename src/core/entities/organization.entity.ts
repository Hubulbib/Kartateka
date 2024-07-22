import { ToolEntity } from './tool.entity'
import { PostEntity } from './post.entity'

export class OrganizationEntity {
  constructor(
    readonly organizationId: number,
    readonly name: string,
    readonly type: string,
    readonly address: string,
    readonly tools: ToolEntity[],
    readonly posts: PostEntity[],
  ) {}
}
