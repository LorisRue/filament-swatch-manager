import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(msw|@mswjs|until-async|headers-polyfill|isomorphic-form-data|strict-event-emitter|rettime)/)",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/e2e/",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/layout.tsx",
    "!src/app/globals.css",
  ],
  coverageThreshold: {
    global: {
      lines: 75,
      statements: 75,
      functions: 70,
      branches: 65,
    },
    "./src/lib/utils.ts": {
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 80,
    },
  },
};

export default createJestConfig(customJestConfig);
