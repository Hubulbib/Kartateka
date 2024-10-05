import { users } from '@prisma/client'
import { EUserType, UserEntity } from '../../../core/entities/user.entity'

export class UserMapper {
  static toDomain(entity: users): Pick<UserEntity, 'userId' | 'type'> {
    return {
      userId: entity.user_id,
      type: EUserType[entity.type],
    }
  }
}
