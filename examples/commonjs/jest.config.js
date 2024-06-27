// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: "jsdom",
  roots: ["src"],
  collectCoverageFrom: ["**/*.js"],
  coveragePathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
