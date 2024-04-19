/**
 * @generated SignedSource<<e3b63bf119830f194fd3baf082a167d5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageQuery$variables = Record<PropertyKey, never>;
export type pageQuery$data = {
  readonly films: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"FilmDirector" | "FilmTitle">;
  }>;
};
export type pageQuery = {
  response: pageQuery$data;
  variables: pageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Film",
        "kind": "LinkedField",
        "name": "films",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FilmTitle"
          },
          {
            "kind": "Defer",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "FilmDirector"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Film",
        "kind": "LinkedField",
        "name": "films",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "if": null,
            "kind": "Defer",
            "label": "pageQuery$defer$FilmDirector",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "director",
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1c9cf2fa87dd3c66a162456f838816b2",
    "id": null,
    "metadata": {},
    "name": "pageQuery",
    "operationKind": "query",
    "text": "query pageQuery {\n  films {\n    id\n    ...FilmTitle\n    ...FilmDirector @defer(label: \"pageQuery$defer$FilmDirector\")\n  }\n}\n\nfragment FilmDirector on Film {\n  director\n}\n\nfragment FilmTitle on Film {\n  title\n}\n"
  }
};
})();

(node as any).hash = "59a2c42faa716c0696f1fc28d6735cf0";

export default node;
