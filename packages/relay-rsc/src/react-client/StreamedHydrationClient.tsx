"use client";

import { ReactNode, Suspense, useMemo } from "react";
import { type PromiseChain } from "../toPromiseChain";
import { type GraphQLTaggedNode } from "relay-runtime";
import { useLazyLoadQuery, useRelayEnvironment } from "react-relay";

export type HydrationMetadata = {
  gqlQuery: GraphQLTaggedNode;
  variables: Record<string, unknown>;
  stream: PromiseChain;
};

export type StreamedHydrationClientProps = {
  hydrationMetadata: HydrationMetadata[];
  children: ReactNode;
};

export function StreamHydrationClient({
  hydrationMetadata,
  children,
}: StreamedHydrationClientProps) {
  console.log("start hydrating");
  return (
    <>
      {hydrationMetadata.map((metadata, index) => (
        <QueryHydrationInitializer key={index} hydrationMetadata={metadata} />
      ))}
      {children}
    </>
  );
}

function QueryHydrationInitializer({
  hydrationMetadata,
}: {
  hydrationMetadata: HydrationMetadata;
}) {
  const environment = useRelayEnvironment();
  const network = environment.getNetwork();

  useMemo(() => {
    console.log("replay");
    // TODO
    // @ts-expect-error
    network.replay(hydrationMetadata);
  }, [hydrationMetadata, network]);

  return (
    <Suspense fallback={null}>
      <QueryHydrationReplayer hydrationMetadata={hydrationMetadata} />
    </Suspense>
  );
}

function QueryHydrationReplayer({
  hydrationMetadata,
}: {
  hydrationMetadata: HydrationMetadata;
}) {
  const { gqlQuery, variables } = hydrationMetadata;

  useLazyLoadQuery(gqlQuery, variables);

  return null;
}
