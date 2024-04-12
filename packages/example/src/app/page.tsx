import Image from "next/image";
import { useFragment } from "relay-rsc";
import { getStreamableQuery } from "relay-rsc";
import { graphql } from "relay-runtime";
import { pageQuery } from "../__generated__/pageQuery.graphql";
import { pageFragment$key } from "../__generated__/pageFragment.graphql";

export default async function Home() {
  const data = await getStreamableQuery<pageQuery>(
    graphql`
      query pageQuery {
        allFilms {
          films {
            id
            ...pageFragment
          }
        }
      }
    `,
    {}
  );

  return (
    <main>
      <h1>Films</h1>

      {data.allFilms?.films?.map(
        (film) => film && <Film key={film.id} filmKey={film} />
      )}
    </main>
  );
}

function Film({ filmKey }: { filmKey: pageFragment$key }) {
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
