/**
 * @generated SignedSource<<56de8226266a009db68b052acb8ebebe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageFragment$data = {
  readonly title: string | null | undefined;
  readonly " $fragmentType": "pageFragment";
};
export type pageFragment$key = {
  readonly " $data"?: pageFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "pageFragment",
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

(node as any).hash = "013d079bafa9d621eb1061c43e261e26";

export default node;
