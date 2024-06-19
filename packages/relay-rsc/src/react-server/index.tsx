/// <reference types="react/experimental" />
import { ReactNode, cache, useMemo } from "react";
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
import {
  StreamHydrationClient,
  type HydrationMetadata,
} from "../react-client/StreamedHydrationClient";
import { rscStreamingMetaDataSymbol } from "../symbols";
import { streamToPromiseChain } from "../toPromiseChain";
import { readFragment } from "./newRelayApis";

// Replay is only necessary for client components
// therefore we export the original Network from relay-runtime
// for server components
//
// This is rather a workaround - a better solution would be to
// to have a network replay API in relay-runtime
export {
  Environment as EnvironmentWithReplay,
  Network as NetworkWithReplay,
} from "relay-runtime";

// For convenience we cache the environment for the user
const getRelayEnvironment = cache(createRelayEnvironment);

type StreamHydrationProps = {
  responses: { [rscStreamingMetaDataSymbol]: HydrationMetadata }[];
  children: ReactNode;
};

/**
 * StreamedHydration must only be used in React Server Components
 * It will stream the data from the server to the client components
 * and trigger the relay store hydration
 */
export function StreamedHydration({
  responses,
  children,
}: StreamHydrationProps) {
  // The HydrationMetadata is attached to the root query response
  // for each streamed query
  // This is easier for the developer, as they can decide for each
  // query if they want to stream the responds data to the Client Components world
  //
  // To save bandwidth the meta data is extracted before it is serialized
  const hydrationMetadata = useMemo(
    () => responses.map((response) => response[rscStreamingMetaDataSymbol]),
    [responses],
  );
  return (
    <StreamHydrationClient hydrationMetadata={hydrationMetadata}>
      {children}
    </StreamHydrationClient>
  );
}

/**
 * Similar to getSeriealizableQuery but with Streaming Support
 */
export async function getStreamableQuery<TOperation extends OperationType>(
  gqlQuery: GraphQLTaggedNode,
  variables: VariablesOf<TOperation>,
): Promise<
  TOperation["response"] & { [rscStreamingMetaDataSymbol]: HydrationMetadata }
> {
  const environment = getRelayEnvironment();
  const request = getRequest(gqlQuery);

  // TODO:
  // Right now the request is executed twice
  //
  // Instead it would probably be possible to use __internal.fetchQueryDeduped from "relay-runtime/lib" as it would give access to:
  // - the raw response
  // - the RelayObservable for the response (the masked data)
  // see
  // https://github.com/facebook/relay/blob/7b69061a6bce3bad53ee2b024627ad7cfa132a1d/packages/relay-runtime/query/fetchQuery.js#L172
  // https://github.com/facebook/relay/blob/7b69061a6bce3bad53ee2b024627ad7cfa132a1d/packages/relay-runtime/query/fetchQueryInternal.js#L103

  const observable = environment
    .getNetwork()
    .execute(request.params, variables, {});

  const data = await fetchQuery(environment, gqlQuery, variables).toPromise();
  const unfrozenData = structuredClone(data);
  return Object.freeze(
    Object.assign(unfrozenData, {
      [rscStreamingMetaDataSymbol]: {
        gqlQuery: (gqlQuery as any).default,
        variables,
        stream: streamToPromiseChain(observable),
      },
    }),
  );
}

/**
 * In React Server Components it is not possible to use useFragment directly
 * as it relies on context. Therefore we need to read the fragment manually using
 * the imaginary new Realy readFragment API.
 */
export const useFragment = ((gqlQuery, fragmentRef) => {
  const environment = getRelayEnvironment();
  return readFragment(gqlQuery, fragmentRef, environment);
}) as any as typeof useRelayFragment;
