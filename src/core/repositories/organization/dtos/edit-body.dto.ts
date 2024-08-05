import { CreateBodyDto } from '../../tool/dtos/create-body.dto'

export class EditBodyDto {
  constructor(
    readonly name?: string,
    readonly type?: string,
    readonly address?: string,
    readonly tools?: CreateBodyDto[],
  ) {}
}
