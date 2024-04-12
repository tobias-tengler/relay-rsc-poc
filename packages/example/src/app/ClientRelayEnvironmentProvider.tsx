"use client";

import { createRelayEnvironment } from "../createRelayEnvironment";
import { ReactNode, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";

export function ClientRelayEnvironmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const environment = useMemo(() => createRelayEnvironment(), []);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
