import { createSchema, createYoga } from "graphql-yoga";
import { useDeferStream } from "@graphql-yoga/plugin-defer-stream";

const typeDefs = /* GraphQL */ `
  type Query {
    films: [Film!]!
  }

  type Film {
    id: ID!
    title: String
    director: String
  }
`;

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const resolvers = {
  Query: {
    films: () => [
      { id: "1", title: "The Shawshank Redemption" },
      { id: "2", title: "The Godfather" },
      { id: "3", title: "The Dark Knight" },
    ],
  },
  Film: {
    director: async (film) => {
      await sleep(film.id * 1000);

      switch (film.id) {
        case "1":
          return "Frank Darabont";
        case "2":
          return "Francis Ford Coppola";
        case "3":
          return "Christopher Nolan";
        default:
          return "Unknown Director";
      }
    },
  },
};

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  plugins: [useDeferStream()],
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export { handleRequest as GET, handleRequest as POST };
