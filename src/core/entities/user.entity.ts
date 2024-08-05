import { OrganizationEntity } from './organization.entity'
import { PostEntity } from './post.entity'

export class UserEntity {
  constructor(
    readonly userId: string,
    readonly type: EUserType,
    readonly organizations: OrganizationEntity[],
    readonly views: PostEntity[],
    readonly favorites: OrganizationEntity[],
  ) {}
}

export enum EUserType {
  basic = 'basic',
  business = 'business',
}
