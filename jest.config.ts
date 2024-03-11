import type { Config } from "jest";
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  verbose: true,
  testTimeout: 30000,
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  coverageReporters: ["json-summary", "text"],
  coveragePathIgnorePatterns: [
    "./src/index.ts",
    "./src/middleware/asyncHandler.ts",
    "./src/middleware/multer.ts",
    "./src/middleware/articleValidation.ts",
    "./src/middleware/project.minddleware.ts",
  ],
  coverageThreshold: {
    global: {
      lines: 50,
    },
  },
};

export default config;
