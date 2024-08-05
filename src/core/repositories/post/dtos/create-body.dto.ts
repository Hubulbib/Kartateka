import { CreateBodyDto as MediaCreateBodyDto } from '../../../repositories/media/dtos/create-body.dto'

export class CreateBodyDto {
  constructor(
    readonly title: string,
    readonly text?: string,
    readonly tags?: string[],
    readonly media?: MediaCreateBodyDto[],
  ) {}
}
