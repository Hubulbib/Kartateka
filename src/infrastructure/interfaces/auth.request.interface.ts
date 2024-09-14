import { type Request } from 'express'

interface IAuth {
  user: IAuthUser
  details: {
    ua: string
    ip: string
  }
}

interface IAuthUser {
  uuid: string
  username: string
  name: string
  surname: string
  email: string
  password: string
  phone: string
  dateBirthday?: Date
  gender: string
  role: string
  avatar?: string
  devices: []
  dates: {
    createdAt: number
    updated: number
  }
}

export type IAuthRequest = Request & {
  auth: IAuth
}
