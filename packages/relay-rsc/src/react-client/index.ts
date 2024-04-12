import { GraphQLTaggedNode, OperationType, VariablesOf } from "relay-runtime";

export const test = "test";

export { useFragment } from "react-relay";

export async function getStreamableQuery<TOperation extends OperationType>(
  gqlQuery: GraphQLTaggedNode,
  variables: VariablesOf<TOperation>
): Promise<TOperation["response"]> {
  throw new Error("Only in RSC");
}
