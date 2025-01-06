import { OrganizationEntity } from './organization.entity.js'
import { PostEntity } from './post.entity.js'

export class UserEntity {
  constructor(
    readonly userId: string,
    readonly type: EUserType,
    readonly organizations: OrganizationEntity[],
    readonly views: PostEntity[],
    readonly favorites: OrganizationEntity[],
  ) {}
}

export type UserEntityShort = Pick<UserEntity, 'userId' | 'type'>

export enum EUserType {
  basic = 'basic',
  business = 'business',
  admin = 'admin',
}
