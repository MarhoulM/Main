/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  moduleNameMapper: {

    '^.+\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',

    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',

    '^.+\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/jestAssetTransformer.cjs',
  },
};

module.exports = config;