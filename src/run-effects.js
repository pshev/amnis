import {withLatestFrom, map, skip} from 'stream-lite/es/operators'

export function runEffects(store, rootEffect, dependencies) {
  const {state$, action$, dispatch} = store

  const actionsAfterStateUpdate$ = state$.pipe(
    // first time state$ emits will be because of the initialState
    // and action will be undefined at that point, so we skip(1)
    skip(1),
    withLatestFrom(action$),
    map(([_, action]) => action),
  )

  const getState = () => state$.getValue()

  rootEffect(actionsAfterStateUpdate$, getState, dependencies).subscribe(dispatch)
}
