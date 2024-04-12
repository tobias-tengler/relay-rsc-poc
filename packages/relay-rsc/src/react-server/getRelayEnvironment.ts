import { IEnvironment } from "relay-runtime";

export type GetRelayEnvironmentFn = () => IEnvironment;

export const getRelayEnvironment: GetRelayEnvironmentFn = () => {
  throw new Error('Please add `{ "imports":  }` to your package.json');
};
