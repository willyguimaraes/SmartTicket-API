/** @type {import('ts-jest').JestConfigWithTsJest} **/
// jest.config.js
export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const testMatch = ["**/tests/**/*.test.ts"];
export const moduleNameMapper = {
  '^@models/(.*)$': '<rootDir>/src/models/$1',
  '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
  '^@services/(.*)$': '<rootDir>/src/services/$1',
  '^@routes/(.*)$': '<rootDir>/src/routes/$1'
};
