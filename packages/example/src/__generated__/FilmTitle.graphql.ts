/**
 * @generated SignedSource<<03fed63e421c6bbc2778daa5930af607>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FilmTitle$data = {
  readonly title: string | null | undefined;
  readonly " $fragmentType": "FilmTitle";
};
export type FilmTitle$key = {
  readonly " $data"?: FilmTitle$data;
  readonly " $fragmentSpreads": FragmentRefs<"FilmTitle">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FilmTitle",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    }
  ],
  "type": "Film",
  "abstractKey": null
};

(node as any).hash = "4a32ec0451c7fd65900b83c6602d5251";

export default node;
