import { CreateBodyDto as MediaCreateBodyDto } from '../../../repositories/media/dtos/create-body.dto.js'

export class CreateBodyDto {
  constructor(
    readonly media: MediaCreateBodyDto[],
    readonly title?: string,
    readonly text?: string,
    readonly tags?: string[],
  ) {}
}
