import type { Config } from "jest";
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  verbose: true,
  testTimeout: 30000,
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        suiteName: "jest tests",
        outputName: "junit.xml",
        // outputDirectory: ".",
      },
    ],
  ],
  coveragePathIgnorePatterns: [
    "./src/index.ts",
    "./src/middleware/asyncHandler.ts",
  ],
  coverageThreshold: {
    global: {
      lines: 50,
    },
  },
};

export default config;
