import { CreateBodyDto } from '../../tool/dtos/create-body.dto'
import { EOrganizationType } from '../../../entities/organization.entity'

export class EditBodyDto {
  constructor(
    readonly name?: string,
    readonly description?: string,
    readonly avatar?: string,
    readonly type?: EOrganizationType,
    readonly address?: string,
    readonly tools?: CreateBodyDto[],
  ) {}
}
