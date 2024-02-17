// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
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
  setupFilesAfterEnv: ["./test/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }],
  },
};
