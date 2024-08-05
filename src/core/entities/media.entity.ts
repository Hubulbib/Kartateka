export class MediaEntity {
  constructor(
    readonly mediaId: number,
    readonly postId: number,
    readonly url: string,
    readonly type: EMediaType,
    readonly createdAt: Date,
  ) {}
}

export enum EMediaType {
  image = 'image',
  video = 'video',
  gif = 'gif',
}
