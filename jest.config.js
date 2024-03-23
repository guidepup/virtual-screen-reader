// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  testEnvironment: "jsdom",
  roots: ["test"],
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.tsx"],
  coveragePathIgnorePatterns: ["/node_modules/", "/test/"],
  coverageThreshold: {
    global: {
      branches: 96,
      functions: 100,
      lines: 98,
      statements: 98,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/test/wpt"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }],
  },
};
