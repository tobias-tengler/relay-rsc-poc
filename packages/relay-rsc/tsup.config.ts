import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/react-server/getRelayEnvironment.ts"],
    outDir: "dist/react-server",
    format: "esm",
    dts: true,
  },
  {
    entry: ["src/react-server/index.ts"],
    outDir: "dist/react-server",
    format: "esm",
    dts: true,
    external: ["relay-rsc"],
  },
  {
    entry: ["src/react-client/index.ts"],
    outDir: "dist/react-client",
    format: "esm",
    dts: true,
  },
]);
