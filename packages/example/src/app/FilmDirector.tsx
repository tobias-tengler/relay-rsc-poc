"use client";

import { useState } from "react";
import { type FilmDirector$key } from "../__generated__/FilmDirector.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export function FilmDirector({ filmKey }: { filmKey: FilmDirector$key }) {
  const [color, setColor] = useState("purple");
  const film = useFragment(
    graphql`
      fragment FilmDirector on Film {
        director
      }
    `,
    filmKey
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
