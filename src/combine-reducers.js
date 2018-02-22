import mapValues from 'map-values'

export const combineReducers = reducers => (state = {}, action) => {
  let hasChanged = false

  const nextState = mapValues(reducers, (reducer, k) => {
    const nextSlice = reducer(state[k], action)
    hasChanged = hasChanged || nextSlice !== state[k]
    return nextSlice
  })

  return hasChanged ? nextState : state
}
