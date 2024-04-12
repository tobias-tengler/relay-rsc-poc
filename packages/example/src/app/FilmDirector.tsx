"use client";

import { useState } from "react";
import { type FilmDirectorFragment$key } from "../__generated__/FilmDirectorFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export function FilmDirector({
  filmKey,
}: {
  filmKey: FilmDirectorFragment$key;
}) {
  const [color, setColor] = useState("purple");
  const film = useFragment(
    graphql`
      fragment FilmDirectorFragment on Film {
        director
      }
    `,
    filmKey,
  );

  return (
    <button
      onClick={() =>
        color === "purple" ? setColor("orange") : setColor("purple")
      }
      style={{ color }}
    >
      by {film.director}
    </button>
  );
}
