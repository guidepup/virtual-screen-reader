// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["test"],
  collectCoverageFrom: ["**/*.ts", "**/*.tsx"],
  coveragePathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  globals: {
    "ts-jest": { tsConfigFile: "tsconfig.test.json" },
  },
};
