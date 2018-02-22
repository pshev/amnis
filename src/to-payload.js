import {map} from 'stream-lite/es/operators'

export const toPayload = stream =>
  stream.pipe(map(x => x.payload))
