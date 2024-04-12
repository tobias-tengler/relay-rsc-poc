import { IEnvironment } from "relay-runtime";

export type createRelayEnvironmentFn = () => IEnvironment;

export const createRelayEnvironment: createRelayEnvironmentFn = () => {
  throw new Error(`We are still exploring the best way to inject an user land Relay environment into the React Server Components cache.
for now please add the following path configuration to your tsconfig.json paths:
"paths": {
  "relay-rsc/createRelayEnvironment": ["./createRelayEnvironment.ts"]
}
And create a createRelayEnvironment.ts file in your project with the following content:

import { IEnvironment } from "relay-runtime";
export const createRelayEnvironment = (): IEnvironment => { ... }

See https://relay.dev/docs/guides/network-layer
  `);
};
