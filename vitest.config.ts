import { defineConfig } from "vitest/config";

// Keep test discovery local, including when cloned inside another Vite project.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
