import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  clean: true,
  dts: true,
  minify: true,
  shims: true,
  skipNodeModulesBundle: true,
});
