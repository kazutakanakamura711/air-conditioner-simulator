import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jest-environment-node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.ts",
    "<rootDir>/tests/unit/**/*.test.tsx",
  ],
  collectCoverageFrom: [
    "lib/**/*.ts",
    "app/**/*.ts",
    "components/**/*.tsx",
    "!**/*.d.ts",
  ],
};

export default createJestConfig(config);
