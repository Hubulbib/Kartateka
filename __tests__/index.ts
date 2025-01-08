import { mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'
import { jest, beforeEach } from '@jest/globals'

const prismaMock = mockDeep<PrismaClient>()

jest.mock('../src/infrastructure/db', () => ({
  __esModule: true,
  prisma: prismaMock,
}))

beforeEach(() => {
  if (prismaMock) {
    mockReset(prismaMock)
  }
})

export { prismaMock }
