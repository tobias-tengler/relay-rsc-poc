import { EnvironmentWithReplay, NetworkWithReplay } from "relay-rsc";
import { FetchFunction, RecordSource, Store } from "relay-runtime";

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
const fetchQuery: FetchFunction = (
  operation,
  variables,
  cacheConfig,
  uploadables
) => {
  console.log("execute", operation.name);

  return fetch("https://swapi-graphql.netlify.app/.netlify/functions/index", {
    method: "POST",
    headers: {
      // Add authentication and other headers here
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then((response) => {
    return response.json();
  });
};

export const createRelayEnvironment = (isClient?: boolean) => {
  // Create a network layer from the fetch function
  const network = NetworkWithReplay.create(fetchQuery);
  const store = new Store(new RecordSource());

  const environment = new EnvironmentWithReplay({
    isServer: true,
    network,
    store,
    // ... other options
  });

  return environment;
};
