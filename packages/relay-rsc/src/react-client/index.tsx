import { RelayObservable } from "relay-runtime/lib/network/RelayObservable";
import { PromiseChain, promiseChainToStream } from "../toPromiseChain";
import { HydrationMetadata } from "./StreamedHydrationClient";
import {
  Environment,
  EnvironmentConfig,
  FetchFunction,
  GraphQLTaggedNode,
  Network,
  Observable,
  ReplaySubject,
  RequestParameters,
  SubscribeFunction,
} from "relay-runtime";

export { useFragment } from "react-relay";

export const StreamedHydration: typeof import("../react-server").StreamedHydration =
  () => {
    throw new Error("Only in RSC");
  };

export const getStreamableQuery: typeof import("../react-server").getStreamableQuery =
  () => {
    throw new Error("Only in RSC");
  };

export class NetworkWithReplay {
  static create(
    fetchFn: FetchFunction,
    subscribeFn?: SubscribeFunction,
  ): ReturnType<typeof Network.create> {
    const replayMap = new Map<RequestParameters, Map<string, PromiseChain>>();

    const wrappedFetchFn: FetchFunction = (...args) => {
      const [params, variables] = args;

      const variablesMap = replayMap.get(params);

      if (variablesMap) {
        const stream = variablesMap.get(JSON.stringify(variables));

        if (stream) {
          variablesMap.delete(JSON.stringify(variables));

          return promiseChainToStream(stream);
        }
      }

      return fetchFn(...args);
    };

    return Object.assign(Network.create(wrappedFetchFn, subscribeFn), {
      replay: (metadata: HydrationMetadata) => {
        // @ts-expect-error
        const params = metadata.gqlQuery.params;
        let variablesMap = replayMap.get(params);

        if (!variablesMap) {
          variablesMap = new Map();
          replayMap.set(params, variablesMap);
        }

        variablesMap.set(JSON.stringify(metadata.variables), metadata.stream);
      },
    });
  }
}

export class EnvironmentWithReplay extends Environment {
  constructor(
    config: Omit<EnvironmentConfig, "network"> & { network: NetworkWithReplay },
  ) {
    super(config as EnvironmentConfig);

    // wrapNetworkWithLogObserver deletes replay, so we have to add it again:
    // @ts-expect-error
    this.getNetwork().replay = config.network.replay;
  }
}
