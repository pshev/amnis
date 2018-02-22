import {create} from 'stream-lite/es/core'
import {scan, startWith} from 'stream-lite/es/operators'

export function createStore(rootReducer, initialState) {
  const action$ = create()

  const state$ = action$.pipe(
    startWith(({type: '@@AMNIS_INIT'})),
    scan(rootReducer, initialState),
  )

  return {
    dispatch: action => action$.next(action),
    action$,
    state$,
  }
}
