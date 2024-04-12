/// <reference types="react/experimental" />
import { cache } from "react";
import {
  GraphQLTaggedNode,
  type useFragment as useRelayFragment,
} from "react-relay";
import { createRelayEnvironment } from "relay-rsc/createRelayEnvironment";
import {
  OperationType,
  VariablesOf,
  fetchQuery,
  getRequest,
} from "relay-runtime";
import { readFragment } from "./newRelayApis";
import { streamToPromiseChain } from "./toPromiseChain";

// Replay is only necessary for client components
// therefore we export the original Network from relay-runtime
// for server components
export { Network as NetworkWithReplay } from "relay-runtime";

// For convenience we cache the environment for the user
const getRelayEnvironment = cache(createRelayEnvironment);

/**
 * To pickup the stream in client components internally the return value
 * of getStreamableQuery has to be extended by
 *  - the original gqlQuery
 *  - the original variables
 *  - the stream of the response
 */
const rscStreamingMetaDataSymbol = Symbol.for("RSC-Stream");

/**
 * Similar to getSeriealizableQuery but with Streaming Support
 */
export async function getStreamableQuery<TOperation extends OperationType>(
  gqlQuery: GraphQLTaggedNode,
  variables: VariablesOf<TOperation>,
): Promise<TOperation["response"]> {
  const environment = getRelayEnvironment();
  const request = getRequest(gqlQuery);

  const observable = environment
    .getNetwork()
    .execute(request.params, variables, {});

  const data = await fetchQuery(environment, gqlQuery, variables).toPromise();

  data[rscStreamingMetaDataSymbol] = {
    gqlQuery,
    variables,
    stream: streamToPromiseChain(observable),
  };

  return data;
}

/**
 * In React Server Components it is not possible to use useFragment directly
 * as it relies on hooks. Therefore we need to read the fragment manually using
 * the imaginary new Realy readFragment API.
 */
export const useFragment = ((gqlQuery, fragmentRef) => {
  const environment = getRelayEnvironment();
  return readFragment(gqlQuery, fragmentRef, environment);
}) as any as typeof useRelayFragment;
