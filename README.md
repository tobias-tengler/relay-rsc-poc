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