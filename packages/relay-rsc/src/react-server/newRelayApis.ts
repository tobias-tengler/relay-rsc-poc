import { useMemo } from "react";
import { KeyTypeData, KeyType } from "react-relay/relay-hooks/helpers";
import {
  ReaderSelector,
  PluralReaderSelector,
  GraphQLTaggedNode,
  IEnvironment,
  getFragment,
  getSelector,
  getPendingOperationsForFragment,
  SelectorData,
  Snapshot,
} from "relay-runtime";

function isPluralReaderSelector(
  selector: ReaderSelector
): selector is PluralReaderSelector {
  return selector.kind === "PluralReaderSelector";
}

// -------------- The below was taken from https://github.com/facebook/relay/blob/80ba6ed967a0f141781f7026a764085fb21da416/packages/react-relay/relay-hooks/useFragmentInternal.js#L363

// TODO: Plural case is not yet supported
export function readFragment<TKey extends KeyType>(
  gqlFragment: GraphQLTaggedNode,
  fragmentRef: TKey,
  environment: IEnvironment
): KeyTypeData<TKey> {
  const fragmentNode = getFragment(gqlFragment);
  const fragmentSelector = getSelector(fragmentNode, fragmentRef);
  const state = getFragmentState(environment, fragmentSelector);
  const isPlural = fragmentNode?.metadata?.plural === true;

  if (isMissingData(state)) {
    const fragmentOwner = isPluralReaderSelector(fragmentSelector)
      ? fragmentSelector.selectors[0].owner
      : fragmentSelector.owner;

    const pendingOperationsResult = getPendingOperationsForFragment(
      environment,
      fragmentNode,
      fragmentOwner
    );
    if (pendingOperationsResult) {
      throw pendingOperationsResult.promise;
    }
  }

  let data: SelectorData | ReadonlyArray<SelectorData> | null = null;
  if (isPlural) {
    // Plural fragments require allocating an array of the snapshot data values,
    // which has to be memoized to avoid triggering downstream re-renders.
    //
    // Note that isPlural is a constant property of the fragment and does not change
    // for a particular useFragment invocation site
    const fragmentRefIsNullish = fragmentRef == null; // for less sensitive memoization
    // eslint-disable-next-line react-hooks/rules-of-hooks
    data = useMemo(() => {
      if (state.kind === "bailout") {
        // Bailout state can happen if the fragmentRef is a plural array that is empty or has no
        // non-null entries. In that case, the compatible behavior is to return [] instead of null.
        return fragmentRefIsNullish ? null : [];
      } else if (state.kind === "plural") {
        return state.snapshots.map((s) => s.data);
      } else {
        return null;
      }
    }, [state, fragmentRefIsNullish]);
  } else if (state.kind === "singular") {
    data = state.snapshot.data;
  }

  return data;
}

function isMissingData(state: FragmentState): boolean {
  if (state.kind === "bailout") {
    return false;
  } else if (state.kind === "singular") {
    return state.snapshot.isMissingData;
  } else {
    return state.snapshots.some((s) => s.isMissingData);
  }
}

type FragmentState =
  | { kind: "bailout" }
  | { kind: "singular"; snapshot: Snapshot; epoch: number }
  | { kind: "plural"; snapshots: ReadonlyArray<Snapshot>; epoch: number };

function getFragmentState(
  environment: IEnvironment,
  fragmentSelector: ReaderSelector
): FragmentState {
  if (fragmentSelector == null) {
    return { kind: "bailout" };
  } else if (isPluralReaderSelector(fragmentSelector)) {
    // Note that if fragmentRef is an empty array, fragmentSelector will be null so we'll hit the above case.
    // Null is returned by getSelector if fragmentRef has no non-null items.
    return {
      kind: "plural",
      snapshots: fragmentSelector.selectors.map((s) => environment.lookup(s)),
      // @ts-expect-error
      epoch: environment.getStore().getEpoch(),
    };
  } else {
    return {
      kind: "singular",
      snapshot: environment.lookup(fragmentSelector),
      // @ts-expect-error
      epoch: environment.getStore().getEpoch(),
    };
  }
}
