import { ToolEntity } from './tool.entity'
import { PostEntity } from './post.entity'
import { ItemEntity } from './item.entity'

export class OrganizationEntity {
  constructor(
    readonly organizationId: number,
    readonly avatar: string,
    readonly name: string,
    readonly description: string,
    readonly type: EOrganizationType,
    readonly address: string,
    readonly tools: ToolEntity[],
    readonly posts: PostEntity[],
    readonly items: ItemEntity[],
  ) {}
}

export type OrganizationEntitySearch = Omit<OrganizationEntity, 'type' | 'address' | 'tools' | 'posts' | 'items'>

export enum EOrganizationType {
  coffee = 'coffee',
  cafe = 'cafe',
  restaurant = 'restaurant',
  tea = 'tea',
}
