/// <reference types="react/experimental" />

import {
  GraphQLTaggedNode,
  type useFragment as useRelayFragment,
} from "react-relay";
import { cache } from "react";
import { getRelayEnvironment } from "relay-rsc/getRelayEnvironment";
import {
  FetchFunction,
  GraphQLResponse,
  Network,
  OperationType,
  SubscribeFunction,
  VariablesOf,
  fetchQuery,
  getRequest,
} from "relay-runtime";
import { readFragment } from "./newRelayApis";
import { RelayObservable } from "relay-runtime/lib/network/RelayObservable";

const getRelayRscEnvironment = cache(getRelayEnvironment);

const symbol = Symbol.for("@@");

export async function getStreamableQuery<TOperation extends OperationType>(
  gqlQuery: GraphQLTaggedNode,
  variables: VariablesOf<TOperation>
): Promise<TOperation["response"]> {
  const environment = getRelayRscEnvironment();

  const request = getRequest(gqlQuery);

  const observable = environment
    .getNetwork()
    .execute(request.params, variables, {});

  const data = await fetchQuery(environment, gqlQuery, variables).toPromise();

  data[symbol] = {
    gqlQuery,
    variables,
    stream: streamToPromiseChain(observable),
  };

  return data;
}

function streamToPromiseChain(observable: RelayObservable<GraphQLResponse>) {
  // TODO: Implement this
}

const useRscFragment = (gqlQuery, fragmentRef) => {
  const environment = getRelayRscEnvironment();

  return readFragment(gqlQuery, fragmentRef, environment);
};

export const useFragment = useRscFragment as any as typeof useRelayFragment;

export class RscNetwork {
  static create(
    fetchFn: FetchFunction,
    subscribeFn?: SubscribeFunction
  ): ReturnType<typeof Network.create> {
    return Network.create(fetchFn, subscribeFn);
  }
}
