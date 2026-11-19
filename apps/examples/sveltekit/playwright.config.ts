import { defineConfig, devices } from "@playwright/test"

const PORT = process.env.PORT || 5173
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results/",
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "dot" : [["line"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Outside production, GitHub sign-in goes to Mockatoo (see src/auth.ts).
    command: `pnpm exec vite dev --port ${PORT}`,
    url: baseURL,
    stdout: "pipe",
    reuseExistingServer: !process.env.CI,
  },
})
