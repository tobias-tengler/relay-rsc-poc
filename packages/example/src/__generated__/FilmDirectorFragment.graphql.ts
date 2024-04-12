/**
 * @generated SignedSource<<155a19c67e481c5e90142c9da76ac9ed>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FilmDirectorFragment$data = {
  readonly director: string | null | undefined;
  readonly " $fragmentType": "FilmDirectorFragment";
};
export type FilmDirectorFragment$key = {
  readonly " $data"?: FilmDirectorFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"FilmDirectorFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FilmDirectorFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "director",
      "storageKey": null
    }
  ],
  "type": "Film",
  "abstractKey": null
};

(node as any).hash = "3c9e6b3f9153292ca85b7bccb968877f";

export default node;
