import { CreateBodyDto as MediaCreateBodyDto } from '../../media/dtos/create-body.dto'

export class EditBodyDto {
  constructor(
    readonly title?: string,
    readonly text?: string,
    readonly tags?: number[],
    readonly media?: MediaCreateBodyDto[],
  ) {}
}
