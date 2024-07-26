import { UserRepository } from '../repositories/user/user.repository'

export class UserService {
  constructor(readonly userRepository: UserRepository) {}

  getFavoriteList = async (userId: string): Promise<number[]> => {
    return await this.userRepository.getFavoriteList(userId)
  }
  getViewedList = async (userId: string): Promise<number[]> => {
    return await this.userRepository.getViewedList(userId)
  }
  getType = async (userId: string): Promise<boolean> => {
    return await this.userRepository.getType(userId)
  }
}
