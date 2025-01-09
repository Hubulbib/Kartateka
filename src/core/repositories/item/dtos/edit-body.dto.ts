import { EItemType } from '../../../entities/item.entity'

export class EditBodyDto {
  constructor(
    readonly name?: string,
    readonly type?: EItemType,
    readonly image?: string,
    readonly price?: number,
    readonly description?: string,
    readonly volumes?: string[],
  ) {}
}
