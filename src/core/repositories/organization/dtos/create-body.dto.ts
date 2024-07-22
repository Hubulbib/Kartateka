export class CreateBodyDto {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly address: string,
  ) {}
}
