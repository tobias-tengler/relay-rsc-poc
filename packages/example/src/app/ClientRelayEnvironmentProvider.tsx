"use client";

import { ReactNode, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { createRelayEnvironment } from "../createRelayEnvironment";

export function ClientRelayEnvironmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const clientComponentRelayEnvironment = useMemo(
    () => createRelayEnvironment(typeof window !== "undefined"),
    []
  );

  return (
    <RelayEnvironmentProvider environment={clientComponentRelayEnvironment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
