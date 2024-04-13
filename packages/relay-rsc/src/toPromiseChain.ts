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
  observable: RelayObservable<GraphQLResponse>,
): PromiseChain {
  let resolveNextChunk: (value: {
      data: GraphQLResponse;
      next: PromiseChain;
    }) => void,
    rejectNextChunk: (reason: any) => void;

  // Create a promise which will be resolved during the first do -> next call
  const streamAsPromise: PromiseChain = new Promise((resolve, reject) => {
    resolveNextChunk = resolve;
    rejectNextChunk = reject;
  });

  observable
    .do({
      next: (data) => {
        console.log("next", data);
        resolveNextChunk({
          data,
          next:
            "hasNext" in data && data.hasNext
              ? // Create a further promise which will be resolved during the next do -> next call
                new Promise((resolve, reject) => {
                  resolveNextChunk = resolve;
                  rejectNextChunk = reject;
                })
              : null,
        });
      },
      complete: () => {
        // Fallback if the stream is empty or hasNext is incorrect
        console.log("complete");
        resolveNextChunk(null);
      },
      error: (err) => {
        rejectNextChunk(err);
      },
    })
    // TODO: is this the correct way to start the stream?
    .toPromise();

  return streamAsPromise;
}

export function promiseChainToStream(stream: PromiseChain) {
  const replaySubject = new ReplaySubject();

  (async () => {
    let next = stream;
    let data: Awaited<PromiseChain>["data"];
    try {
      do {
        // Wait for the next data chunk in the promise chain
        // and replay it to the replay subject.
        const streamChunk = await next;
        data = streamChunk.data;
        next = streamChunk.next;
        console.log("next replay", data);
        replaySubject.next(data);
      } while (next);
    } catch (err) {
      console.error("error replay", err);
      replaySubject.error(err);
      return;
    }
    console.log("complete replay");
    replaySubject.complete();
  })();

  // Replay all responses to the observable that is returned to Relay.
  return Observable.create<GraphQLResponse>((sink) =>
    replaySubject.subscribe(sink),
  );
}
