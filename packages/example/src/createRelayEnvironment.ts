import { EnvironmentWithReplay, NetworkWithReplay } from "relay-rsc";
import {
  FetchFunction,
  GraphQLResponse,
  Observable,
  RecordSource,
  Store,
} from "relay-runtime";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { meros } from "meros/browser";

const fetchFn: FetchFunction = (operation, variables) => {
  return Observable.create((sink) => {
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept:
          "application/graphql-response+json;charset=utf-8, multipart/mixed;charset=utf-8",
      },
      body: JSON.stringify({
        id: operation.id ?? undefined,
        query: operation.text ?? undefined,
        variables,
      }),
    };
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://relay-rsc-poc.vercel.app/"
        : "http://localhost:3000/";

    (async () => {
      try {
        const response = await fetch(
          new URL("/api/graphql", baseUrl),
          requestInit
        );

        if (response.ok) {
          try {
            const parts = await meros(response);

            if (isAsyncIterable(parts)) {
              for await (const part of parts) {
                if (!part.json) {
                  sink.error(
                    new Error("Received non-JSON response from server")
                  );
                  break;
                }

                if ("data" in part.body) {
                  sink.next(part.body);
                } else if ("errors" in part.body) {
                  sink.error(new Error("Incremental response contained error"));
                  break;
                }

                if ("incremental" in part.body) {
                  for (const chunk of part.body.incremental) {
                    if ("data" in chunk) {
                      sink.next({
                        ...chunk,
                        hasNext: part.body.hasNext,
                      } as GraphQLResponse);
                    }
                  }
                }
              }
            } else {
              const json = await response.json();

              if ("data" in json) {
                sink.next(json);
              } else if ("errors" in json) {
                sink.error(new Error("Response contained errors"));
              }
            }

            sink.complete();
          } catch (err) {
            sink.error(new Error("Could not handle response"), true);
          }
        } else {
          sink.error(new Error("Network request was not successful"));
        }
      } catch (err) {
        console.log(err);
        sink.error(new Error("Network request failed"), true);
      }
    })();
  });
};

let clientSideRelayEnvironment: RelayModernEnvironment | null = null;

export const createRelayEnvironment = (isBrowser?: boolean) => {
  if (isBrowser && clientSideRelayEnvironment) {
    return clientSideRelayEnvironment;
  }

  const network = NetworkWithReplay.create(fetchFn);
  const store = new Store(new RecordSource());

  const environment = new EnvironmentWithReplay({
    isServer: !isBrowser,
    network,
    store,
  });

  if (isBrowser && !clientSideRelayEnvironment) {
    clientSideRelayEnvironment = environment;
  }

  return environment;
};

type Part = {
  json: boolean;
  body: GraphQLResponse & {
    incremental: {
      data: unknown;
      label?: string;
      path: (string | number)[];
    }[];
    hasNext: boolean;
  };
};

export const isAsyncIterable = (
  value: unknown
): value is AsyncGenerator<Part> =>
  typeof Object(value)[Symbol.asyncIterator] === "function";
