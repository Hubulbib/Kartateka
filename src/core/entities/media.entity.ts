export class MediaEntity {
  constructor(
    readonly mediaId: number,
    readonly postId: number,
    readonly url: string,
    readonly type: string,
    readonly createdAt: Date,
  ) {}
}
