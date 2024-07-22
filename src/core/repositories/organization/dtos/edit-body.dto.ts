export class EditBodyDto {
  constructor(
    readonly name?: string,
    readonly type?: string,
    readonly address?: string,
    readonly tools?: number[],
  ) {}
}
