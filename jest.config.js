/** Scoring is pure TypeScript with no React Native imports, so ts-jest alone runs it. */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  watchman: false,
};
