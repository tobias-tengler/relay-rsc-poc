import { FetchFunction, Network, SubscribeFunction } from "relay-runtime";

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
    subscribeFn?: SubscribeFunction
  ): ReturnType<typeof Network.create> {
    return Network.create(fetchFn, subscribeFn);
  }
}
