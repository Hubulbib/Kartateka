import { ToolEntity } from './tool.entity.js'
import { PostEntity } from './post.entity.js'
import { ItemEntity } from './item.entity.js'

export class OrganizationEntity {
  constructor(
    readonly organizationId: number,
    readonly avatar: string,
    readonly name: string,
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
