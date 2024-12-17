module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'ts',
    'json'
  ],
  testMatch: [
    '**/?(*.)+(spec|test).ts?(x)',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.js?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!chai/)',
  ],
};