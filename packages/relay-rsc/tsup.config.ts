import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/react-server/createRelayEnvironment.ts"],
    outDir: "dist/react-server",
    format: "esm",
    dts: true,
  },
  {
    entry: ["src/react-server/index.tsx"],
    outDir: "dist/react-server",
    format: "esm",
    dts: true,
    external: [
      "relay-rsc",
      // Without the external it would remove the "use client" and inline the definition.
      "../react-client/StreamedHydrationClient",
    ],
  },
  {
    entry: ["src/react-client/index.tsx"],
    outDir: "dist/react-client",
    format: "esm",
    dts: true,
  },
  {
    entry: ["src/react-client/StreamedHydrationClient.tsx"],
    outDir: "dist/react-client",
    format: "esm",
    dts: true,
  },
]);
