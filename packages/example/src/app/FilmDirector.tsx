"use client";

import { pageDirectorFragment$key } from "@/__generated__/pageDirectorFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export function FilmDirector({
  filmKey,
}: {
  filmKey: pageDirectorFragment$key;
}) {
  const film = useFragment(
    graphql`
      fragment pageDirectorFragment on Film {
        director
      }
    `,
    filmKey
  );

  return <div>by {film.director}</div>;
}
