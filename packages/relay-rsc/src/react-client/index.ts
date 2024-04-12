import {
  FetchFunction,
  GraphQLTaggedNode,
  Network,
  OperationType,
  SubscribeFunction,
  VariablesOf,
} from "relay-runtime";

export { useFragment } from "react-relay";

export async function getStreamableQuery<TOperation extends OperationType>(
  gqlQuery: GraphQLTaggedNode,
  variables: VariablesOf<TOperation>
): Promise<TOperation["response"]> {
  throw new Error("Only in RSC");
}

export class RscNetwork {
  static create(
    fetchFn: FetchFunction,
    subscribeFn?: SubscribeFunction
  ): ReturnType<typeof Network.create> {
    return Network.create(fetchFn, subscribeFn);
  }
}
