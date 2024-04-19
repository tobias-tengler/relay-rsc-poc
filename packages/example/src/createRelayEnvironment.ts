import { EnvironmentWithReplay, NetworkWithReplay } from "relay-rsc";
import {
  FetchFunction,
  GraphQLResponse,
  Observable,
  RecordSource,
  RequestParameters,
  Store,
} from "relay-runtime";
import { Sink } from "relay-runtime/lib/network/RelayObservable";

const fetchQuery: FetchFunction = (operation) => {
  return Observable.create((sink) => {
    (async () => {
      console.log("execute network");
      await __simulateDeferredResponse(operation, sink);
    })();
  });
};

export const createRelayEnvironment = (isClient?: boolean) => {
  const network = NetworkWithReplay.create(fetchQuery);
  const store = new Store(new RecordSource());

  const environment = new EnvironmentWithReplay({
    isServer: !isClient,
    network,
    store,
  });

  return environment;
};

async function __simulateDeferredResponse(
  operation: RequestParameters,
  sink: Sink<GraphQLResponse>
) {
  await sleep(500);

  // Send the initial response
  sink.next({
    data: {
      films: [
        {
          id: "1",
          title: "The Shawshank Redemption",
        },
        {
          id: "2",
          title: "The Godfather",
        },
        {
          id: "3",
          title: "The Dark Knight",
        },
      ],
    },
    // @ts-expect-error
    hasNext: true,
  });

  await sleep(500);

  sink.next({
    data: {
      director: "Frank Darabont",
    },
    path: ["films", 0],
    label: "pageQuery$defer$FilmDirector",
    // @ts-expect-error
    hasNext: true,
  });

  await sleep(500);

  sink.next({
    data: {
      director: "Francis Ford Coppola",
    },
    path: ["films", 1],
    label: "pageQuery$defer$FilmDirector",
    // @ts-expect-error
    hasNext: true,
  });

  await sleep(500);

  sink.next({
    data: {
      director: "Christopher Nolan",
    },
    path: ["films", 2],
    label: "pageQuery$defer$FilmDirector",
    // @ts-expect-error
    hasNext: false,
  });

  sink.complete();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
