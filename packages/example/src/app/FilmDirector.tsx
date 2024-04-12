"use client";

import { type FilmDirectorFragment$key } from "../__generated__/FilmDirectorFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export function FilmDirector({
  filmKey,
}: {
  filmKey: FilmDirectorFragment$key;
}) {
  const film = useFragment(
    graphql`
      fragment FilmDirectorFragment on Film {
        director
      }
    `,
    filmKey
  );

  return <div>by {film.director}</div>;
}
