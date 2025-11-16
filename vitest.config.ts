import "vitest/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["dist","node_modules"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["html", "lcov", "clover", "text"],
    },
  },
});
