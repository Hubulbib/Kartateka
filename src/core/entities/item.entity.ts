export class ItemEntity {
  constructor(
    readonly itemId: number,
    readonly organizationId: number,
    readonly name: string,
    readonly type: EItemType,
    readonly image?: string,
    readonly price?: number,
    readonly description?: string,
    readonly volumes?: string[],
  ) {}
}

export enum EItemType {
  drink = 'drink',
  dish = 'dish',
  bakerGoods = 'baker_goods',
  confectionery = 'confectionery',
}
