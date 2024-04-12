/**
 * To pickup the stream in client components internally the return value
 * of getStreamableQuery has to be extended by
 *  - the original gqlQuery
 *  - the original variables
 *  - the stream of the response
 */
export const rscStreamingMetaDataSymbol = Symbol.for("RSC-Stream");
