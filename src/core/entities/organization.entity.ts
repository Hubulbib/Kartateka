import { ToolEntity } from './tool.entity'
import { PostEntity } from './post.entity'

export class OrganizationEntity {
  constructor(
    readonly organizationId: number,
    readonly avatar: string,
    readonly name: string,
    readonly type: EOrganizationType,
    readonly address: string,
    readonly tools: ToolEntity[],
    readonly posts: PostEntity[],
  ) {}
}

export enum EOrganizationType {
  coffee = 'coffee',
  cafe = 'cafe',
  restaurant = 'restaurant',
  tea = 'tea',
}
