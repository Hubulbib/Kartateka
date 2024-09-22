import { EOrganizationType } from '../../../entities/organization.entity'
import { CreateBodyDto as ToolCreateBodyDto } from '../../tool/dtos/create-body.dto'

export class CreateBodyDto {
  constructor(
    readonly name: string,
    readonly avatar: string,
    readonly type: EOrganizationType,
    readonly address: string,
    readonly tools?: ToolCreateBodyDto[],
  ) {}
}
