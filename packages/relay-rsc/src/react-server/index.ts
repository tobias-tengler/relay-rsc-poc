import { type useFragment as useRelayFragment } from "react-relay";
import { getRelayEnvironment } from "relay-rsc/getRelayEnvironment";

const useRscFragment = (gqlQuery, fragmentRef) => {
  const environment = getRelayEnvironment();

  console.log(environment);
};

export const useFragment = useRscFragment as any as typeof useRelayFragment;
