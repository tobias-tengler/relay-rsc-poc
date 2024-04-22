# Relay with React Server Components

This repository is a proof of concept using Next.js, React Server Components and Relay.

The usual way to use Relay with Next.js Server Side Rendering has the following steps:

1. create a Relay store on the server
2. populate the Relay store
3. serialize Relay store and pass it to the client

A similar flow is also possible with React Server Components:

1. create a Relay store in a server component context with [React cache](https://react.dev/reference/react/cache)
2. populate the Relay store
3. serialize Relay store and pass it to a client component

However React Server Components introduced a way to serialize promises.
Serialized promises opens up a new way to use Relay with React Server Components:

1. create a Relay store in a server component context with [React cache](https://react.dev/reference/react/cache)
2. serialize relay query response streams
3. stream the serialized response streams to the client component

With this approach, it is possible to start hydrating the Relay store on the client while the server is still streaming the response.
This can potentially reduce the time to first byte and improve the perceived performance of the application.

Especially with `@defer` and `@stream` directives, it is possible to start rendering the page with the initial data while the server is still fetching the rest of the data.

[SSR vs SSR with Streaming](https://github.com/tobias-tengler/relay-rsc-poc/assets/4113649/363295b2-5297-47c5-a83b-968d715b9b2c)

## Features

1. Render Fragments in React Server Components
2. Render Fragments in React Client Components
3. Use the same root query for React Server Components and Client Components
4. Use different same root queries for React Server Components and Client Components
5. Server Streaming to React Server Components and Client Components

## Example

Demo: https://relay-rsc-poc.vercel.app/  
[Example Code](https://github.com/tobias-tengler/relay-rsc-poc/tree/main/packages/example/src/app)

`<FilmTitle>` is a React Server Component  
`<FilmDirector>` is a React Client Component

```tsx
export default async function Home() {
  const data = await getStreamableQuery<pageQuery>(
    graphql`
      query pageQuery {
        films {
          id
          ...FilmTitle
          ...FilmDirector @defer
        }
      }
    `,
    {}
  );

  return (
    <StreamedHydration responses={[data]}>
      <main>
        <h1>Films</h1>
        {data.films?.map(
          (film) =>
            film && (
              <>
                <FilmTitle filmKey={film} />
                <Suspense key={film.id} fallback={<div>🌀 Loading...</div>}>
                  <FilmDirector filmKey={film} />
                </Suspense>
              </>
            )
        )}
      </main>
    </StreamedHydration>
  );
}
```

## Similar POCs

There are similar POCs:

- https://github.com/Pokeyo-AB/relay-rsc (no streaming support)
- https://github.com/mizdra/poc-nextjs-app-router-relay  (no streaming support)
