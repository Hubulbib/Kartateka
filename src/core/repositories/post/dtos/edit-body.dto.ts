import { CreateBodyDto as MediaCreateBodyDto } from '../../media/dtos/create-body.dto.js'

export class EditBodyDto {
  constructor(
    readonly title?: string,
    readonly text?: string,
    readonly tags?: string[],
    readonly media?: MediaCreateBodyDto[],
  ) {}
}
