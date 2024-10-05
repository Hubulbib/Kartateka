export interface ViewRepository {
  getCount(postId: number): Promise<number>
  setViewed(postId: number, userId: string): Promise<void>
  getByUser(userId: string): Promise<{ userId: string; postId: number }[]>
}
