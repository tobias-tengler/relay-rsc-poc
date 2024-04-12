"use client";

import { ReactNode } from "react";
import { type PromiseChain } from "../react-server/toPromiseChain";
import { rscStreamingMetaDataSymbol } from "../symbols";
import { GraphQLTaggedNode } from "relay-runtime";

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
  return <>{children}</>;
}
