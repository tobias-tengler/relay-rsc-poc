"use client";

import { ReactNode, Suspense } from "react";
import { type PromiseChain } from "../react-server/toPromiseChain";
import { type GraphQLTaggedNode } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";

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
  return (
    <>
      {hydrationMetadata.map((metadata, index) => (
        <Suspense key={index} fallback={null}>
          <QueryHydrationReplayer hydrationMetadata={metadata} />
        </Suspense>
      ))}
      {children}
    </>
  );
}

function QueryHydrationReplayer({
  hydrationMetadata,
}: {
  hydrationMetadata: HydrationMetadata;
}) {
  const { gqlQuery, variables, stream } = hydrationMetadata;

  useLazyLoadQuery(gqlQuery, variables);

  return null;
}
