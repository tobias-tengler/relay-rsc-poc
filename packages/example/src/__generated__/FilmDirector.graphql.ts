/**
 * @generated SignedSource<<dd73146c5f35acee3d01a20d9e75d443>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FilmDirector$data = {
  readonly director: string | null | undefined;
  readonly " $fragmentType": "FilmDirector";
};
export type FilmDirector$key = {
  readonly " $data"?: FilmDirector$data;
  readonly " $fragmentSpreads": FragmentRefs<"FilmDirector">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FilmDirector",
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

(node as any).hash = "1c717ee56d4cbb0a56a2ef7af0d2a2c5";

export default node;
