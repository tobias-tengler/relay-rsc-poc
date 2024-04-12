import { IEnvironment } from "relay-runtime";

export type GetRelayEnvironmentFn = () => IEnvironment;

export const getRelayEnvironment: GetRelayEnvironmentFn = () => {
  throw new Error(`We are still exploring the best way to inject an user land Relay environment into the React Server Components cache.
for now please add the following path configuration to your tsconfig.json paths:
"paths": {
  "relay-rsc/getRelayEnvironment": ["./getRelayEnvironment.ts"]
}
And create a getRelayEnvironment.ts file in your project with the following content:

import { IEnvironment } from "relay-runtime";
export const getRelayEnvironment = (): IEnvironment => { ... }
  `);
};
