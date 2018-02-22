import {merge} from 'stream-lite/es/statics'

export const combineEffects = (...effects) => (...args) =>
  merge(...effects.map(effect => effect(...args)))
