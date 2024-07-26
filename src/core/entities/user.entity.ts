import { OrganizationEntity } from './organization.entity'
import { PostEntity } from './post.entity'

export class UserEntity {
  constructor(
    readonly userId: string,
    readonly type: string,
    readonly organizations: OrganizationEntity[],
    readonly views: PostEntity[],
    readonly favorites: OrganizationEntity[],
  ) {}
}
