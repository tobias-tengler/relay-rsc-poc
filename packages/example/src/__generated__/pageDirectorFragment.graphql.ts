/**
 * @generated SignedSource<<2c9191c6855c266d9eee72b351646851>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageDirectorFragment$data = {
  readonly director: string | null | undefined;
  readonly " $fragmentType": "pageDirectorFragment";
};
export type pageDirectorFragment$key = {
  readonly " $data"?: pageDirectorFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageDirectorFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "pageDirectorFragment",
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

(node as any).hash = "bc7b346534becac4cb2ccae9116da0e1";

export default node;
