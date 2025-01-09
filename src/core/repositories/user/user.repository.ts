import { PostEntity } from '../../entities/post.entity'
import { RegisterBodyDto } from './dtos/register-body.dto'
import { UserEntityShort } from '../../entities/user.entity'
import { OrganizationEntity } from '../../entities/organization.entity'

export interface UserRepository {
  register: (registerBody: RegisterBodyDto) => Promise<UserEntityShort>
  //getSubscribe: (userId: string) => Promise<void>
  getOneById: (userId: string) => Promise<UserEntityShort>
  getFavoriteList: (userId: string) => Promise<OrganizationEntity[]>
  getViewedList: (userId: string) => Promise<PostEntity[]>
  getType: (userId: string) => Promise<string>
}
