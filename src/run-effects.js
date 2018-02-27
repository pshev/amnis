import {merge, fromObservable} from 'stream-lite/es/statics'
import {withLatestFrom, map, skip} from 'stream-lite/es/operators'

export function runEffects({store, effects, dependencies, adapter}) {
  const {state$, action$, dispatch} = store

  const adaptTo = adapter || (action$ => action$)
  const adaptFrom = adapter ? (action$ => fromObservable(action$)) : (action$ => action$)

  const actionsAfterStateUpdate$ = state$.pipe(
    // first time state$ emits will be because of the initialState
    // and action will be undefined at that point, so we skip(1)
    skip(1),
    withLatestFrom(action$),
    map(([_, action]) => action),
  )

  const getState = () => state$.getValue()

  const effectStreams = effects.map(effectFn => {
    const actionAsObservable = adaptTo(actionsAfterStateUpdate$)
    const effectAsObservable = effectFn(actionAsObservable, getState, dependencies)
    return adaptFrom(effectAsObservable)
  })

  merge(...effectStreams).subscribe(dispatch)
}
