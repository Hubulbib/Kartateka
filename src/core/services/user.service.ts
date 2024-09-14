import { UserRepository } from '../repositories/user/user.repository'
import { EUserType, UserEntity } from '../entities/user.entity'
import { OrganizationEntity } from '../entities/organization.entity'
import { PostEntity } from '../entities/post.entity'
import { RegisterBodyDto } from '../repositories/user/dtos/register-body.dto'

export class UserService {
  constructor(readonly userRepository: UserRepository) {}

  register = async (registerBody: RegisterBodyDto): Promise<UserEntity> => {
    return await this.userRepository.register(registerBody)
  }

  /*getSubscribe = async (userId: string): Promise<void> => {
    await this.userRepository.getSubscribe(userId)
  }*/

  getOneById = async (userId: string): Promise<UserEntity> => {
    return await this.userRepository.getOneById(userId)
  }

  getFavoriteList = async (userId: string): Promise<OrganizationEntity[]> => {
    return await this.userRepository.getFavoriteList(userId)
  }
  getViewedList = async (userId: string): Promise<PostEntity[]> => {
    return await this.userRepository.getViewedList(userId)
  }
  getType = async (userId: string): Promise<EUserType> => {
    const type = await this.userRepository.getType(userId)
    return EUserType[type] || EUserType.basic
  }
}
