import { GraphQLResponse, Observable, ReplaySubject } from "relay-runtime";
import { RelayObservable } from "relay-runtime/lib/network/RelayObservable";

export type PromiseChain = Promise<{
  data: GraphQLResponse;
  next: PromiseChain | null;
}>;

/**
 * Data can only be transfered from React Server Components to Client Components
 * if the data is serializable.
 *
 * This function converts a realy stream into a serializable promise chain.
 */
export function streamToPromiseChain(
  observable: RelayObservable<GraphQLResponse>
): PromiseChain {
  let resolve, reject;

  const streamAsPromise: PromiseChain = new Promise((r, rr) => {
    resolve = r;
    reject = rr;
  });

  observable
    .do({
      next: (data) => {
        console.log("next", data);
        resolve({
          data,

          next:
            "hasNext" in data && data.hasNext
              ? new Promise((r, rr) => {
                  resolve = r;
                  reject = rr;
                })
              : null,
        });
      },
      complete: () => {
        console.log("complete");
        resolve();
      },
      error: (err) => {
        reject(err);
      },
    })
    .toPromise();

  return streamAsPromise;
}

export function promiseChainToStream(stream: PromiseChain) {
  const replaySubject = new ReplaySubject();

  (async () => {
    let promise = stream;

    do {
      const { data, next } = await promise;

      console.log("next replay", data);

      replaySubject.next(data);

      if (!next) {
        break;
      }

      promise = next;

      // eslint-disable-next-line no-constant-condition
    } while (true);

    console.log("complete replay");

    replaySubject.complete();
  })();

  // Replay all responses to the observable that is returned to Relay.
  return Observable.create<GraphQLResponse>((sink) =>
    replaySubject.subscribe(sink)
  );
}
