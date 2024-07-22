export class ToolEntity {
  constructor(
    readonly toolId: number,
    readonly name: string,
    readonly content: object,
    readonly organizationId: number,
  ) {}
}
