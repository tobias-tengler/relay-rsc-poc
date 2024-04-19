import { graphql } from "relay-runtime";
import { useFragment } from "relay-rsc";
import { FilmTitle$key } from "../__generated__/FilmTitle.graphql";

export function FilmTitle({ filmKey }: { filmKey: FilmTitle$key }) {
  const film = useFragment(
    graphql`
      fragment FilmTitle on Film {
        title
      }
    `,
    filmKey
  );

  return <div>{film.title}</div>;
}
