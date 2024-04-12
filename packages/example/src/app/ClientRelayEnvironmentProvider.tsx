"use client";

import { ReactNode } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { createRelayEnvironment } from "../createRelayEnvironment";

// Is this dangerous during SSR?
const clientComponentRelayEnvironment = createRelayEnvironment(typeof window !== "undefined");

export function ClientRelayEnvironmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RelayEnvironmentProvider environment={clientComponentRelayEnvironment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
