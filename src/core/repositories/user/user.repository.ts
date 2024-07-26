export interface UserRepository {
  getFavoriteList: (userId: string) => Promise<number[]>
  getViewedList: (userId: string) => Promise<number[]>
  getType: (userId: string) => Promise<boolean>
}
