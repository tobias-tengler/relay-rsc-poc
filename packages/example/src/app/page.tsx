import { Fragment } from "react";
import { StreamedHydration, getStreamableQuery, useFragment } from "relay-rsc";
import { graphql } from "relay-runtime";
import type { pageFragment$key } from "../__generated__/pageFragment.graphql";
import type { pageQuery } from "../__generated__/pageQuery.graphql";
import { FilmDirector } from "./FilmDirector";

export default async function Home() {
  const data = await getStreamableQuery<pageQuery>(
    graphql`
      query pageQuery {
        allFilms {
          films {
            id
            ...pageFragment
            ...FilmDirectorFragment
          }
        }
      }
    `,
    {}
  );

  return (
    <StreamedHydration responses={[data]}>
      <main>
        <h1>Films</h1>

        {data.allFilms?.films?.map(
          (film) =>
            film && (
              <Fragment key={film.id}>
                <FilmTitle filmKey={film} />
                <FilmDirector filmKey={film} />
              </Fragment>
            )
        )}
      </main>
    </StreamedHydration>
  );
}

function FilmTitle({ filmKey }: { filmKey: pageFragment$key }) {
  const film = useFragment(
    graphql`
      fragment pageFragment on Film {
        title
      }
    `,
    filmKey
  );

  return <div>{film.title}</div>;
}
