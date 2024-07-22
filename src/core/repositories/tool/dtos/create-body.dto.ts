export class CreateBodyDto {
  constructor(
    readonly name: string,
    readonly content: object,
  ) {}
}
