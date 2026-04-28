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
    // Exclude generated shadcn UI components (library code, not business logic)
    "!src/components/ui/**",
    // Exclude complex form component – tested via E2E, mocked in unit/integration tests
    "!src/components/FilamentForm.tsx",
    // Exclude helper components with no isolated testable logic
    "!src/components/SuggestiveTextInput.tsx",
    "!src/components/Providers.tsx",
    // Exclude the filament detail page – requires live Supabase, covered by E2E
    "!src/app/filament/**",
    // Exclude static data and infrastructure files
    "!src/data/**",
    "!src/lib/supabaseClient.ts",
    // Exclude type declaration files and Next.js boilerplate
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
