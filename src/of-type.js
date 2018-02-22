import {filter} from 'stream-lite/es/operators'

export const ofType = type => stream =>
  stream.pipe(filter(x => x.type === type))
