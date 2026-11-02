import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/**/*.test.ts"],
          exclude: ["tests/api/**"],
          setupFiles: ["tests/setup.ts"],
        },
      },
      {
        test: {
          name: "api",
          environment: "node",
          include: ["tests/api/**/*.test.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/demo.ts", "src/server.ts"],
      reporter: ["text", "html", "json-summary"],
      thresholds: { branches: 90 },
    },
  },
});
