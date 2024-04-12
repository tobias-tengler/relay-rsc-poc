import { GraphQLResponse } from "relay-runtime";
import { RelayObservable } from "relay-runtime/lib/network/RelayObservable";

export type PromiseChain = void;

/**
 * Data can only be transfered from React Server Components to Client Components
 * if the data is serializable.
 *
 * This function converts a realy stream into a serializable promise chain.
 */
export function streamToPromiseChain(
  observable: RelayObservable<GraphQLResponse>
): PromiseChain {
  // TODO: Implement this
}
