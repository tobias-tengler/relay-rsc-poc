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
import { readFragment } from "./newRelayApis";
import { streamToPromiseChain } from "./toPromiseChain";
import { rscStreamingMetaDataSymbol } from "../symbols";
import {
  type StreamedHydrationClientProps,
  StreamHydrationClient,
  type HydrationMetadata,
} from "../react-client/StreamedHydrationClient";

// Replay is only necessary for client components
// therefore we export the original Network from relay-runtime
// for server components
export { Network as NetworkWithReplay } from "relay-runtime";

// For convenience we cache the environment for the user
const getRelayEnvironment = cache(createRelayEnvironment);

type StreamHydrationProps = {
  responses: { [rscStreamingMetaDataSymbol]: HydrationMetadata }[];
  children: ReactNode;
};

export function StreamedHydration({
  responses,
  children,
}: StreamHydrationProps) {
  const hydrationMetadata = useMemo(
    () => responses.map((response) => response[rscStreamingMetaDataSymbol]),
    [responses]
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
  variables: VariablesOf<TOperation>
): Promise<
  TOperation["response"] & { [rscStreamingMetaDataSymbol]: HydrationMetadata }
> {
  const environment = getRelayEnvironment();
  const request = getRequest(gqlQuery);

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
    })
  );
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
