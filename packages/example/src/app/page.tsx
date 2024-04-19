import { Fragment, Suspense } from "react";
import { StreamedHydration, getStreamableQuery, useFragment } from "relay-rsc";
import { graphql } from "relay-runtime";
import type { pageQuery } from "../__generated__/pageQuery.graphql";
import { FilmDirector } from "./FilmDirector";
import { FilmTitle } from "./FilmTitle";

// Without this the page would be cached and not revalidated
export const dynamic = "force-dynamic";

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

                <Suspense key={film.id} fallback={<p>Loading director...</p>}>
                  <FilmDirector filmKey={film} />
                </Suspense>
              </>
            )
        )}
      </main>
    </StreamedHydration>
  );
}
