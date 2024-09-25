export class CreateBodyDto {
  constructor(
    readonly url: string,
    readonly type: string,
    readonly number: number,
  ) {}
}
