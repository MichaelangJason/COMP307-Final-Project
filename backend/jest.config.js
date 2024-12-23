/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  
  // Update test match to look for TypeScript test files
  testMatch: [
    "<rootDir>/src/tests/**/*.test.ts"
  ],

  // Add module name mapper for path aliases
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/../shared/$1",
    "^utils$": "<rootDir>/src/utils/index.ts"
  },

  // Add TypeScript transform
  transform: {
    "^.+\\.ts$": "ts-jest"
  },

  // Add both JS and TS extensions
  moduleFileExtensions: ['ts', 'js'],

  rootDir: ".",
};

module.exports = config;
