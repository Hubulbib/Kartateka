/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  setupFilesAfterEnv: ['./__tests__/index.ts'],
}
