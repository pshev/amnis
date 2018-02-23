<p align="center" style="margin-top: 25px">
  <strong>Minimal yet complete state and effect management solution</strong>
</p>

## ✨ Features:
- Tiny in size.
- Complete. Handles both state and effects
- Redux pattern
- Familiar interface

## 💡 Motivation

Redux is great. But out of the box it only deals with synchronous actions.<br/>
We know of a great way to model asynchronous actions - that is with [`Observables`](https://github.com/tc39/proposal-observable). That is exactly what [`redux-observable`](http://npm.im/redux-observable) does. But it turns out that if you are armed with observables you can model the whole redux pattern in pretty much one line of code:
```js
// pseudo code
const state$ = action$
  .startWith(initialState)
  .scan(rootReducer)
```
This is not a new idea and many different proposals have been made that replace `redux` with something like `rxjs`. However they usually require you to completely change the way you write your redux applications. For example you would have to write `actions` and `reducers` as observables, while they are better of staying as pure simple functions. Those approaches are also usually tied to a specific observable library, like `rxjs` which introduces bloat into your application.
<br />
<br />
With `amnis` you get to write your redux applications like you're used to. Except without `redux`. Create your `store`, `actions`, and `reducers` like you always have. But then use [any observable library](#adapters) where it makes sense - for effect management. Better yet, you get all of that in ***1.5KB gzipped***.

## 🔧 Installation

Assuming you use [npm](https://www.npmjs.com/) as your package manager:
```text
npm install --save amnis
```
Then you can use it from [Node](https://nodejs.org/en/) environment or if you are building for the browser you can use a module bundler like [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/), or [Rollup](http://rollupjs.org).
<br/>
<br/>
If you want to experiment and play around with Amnis without a module bundler or you don't use one - that's OK. 
Amnis npm package includes precompiled production and development UMD builds. 
You can just drop a UMD build as a `<script>` tag on a page. The UMD builds make `amnis` available as a `window.amnis`.

## 🔨 Usage

First, let's look at an example that doesn't use effects.
#### Counter
You start by creating a reducer function just like you would in `redux`:
```js
export function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```
Then you create a `store`
<br/>
`createStore` accepts the rootReducer, an optional initialState parameter, and an optional 3rd parameter - an [adapter](#adapters) for you to use any observable library that you want.
<br/>
There is no concept of middleware in Amnis since there is no need for it.

```js
import {createStore} from 'amnis'
import {counter} from './counter'

const store = createStore(counter)
```
It returns an object with 3 properties:
<br/>
`state$` - an observable of states
<br/>
`action$` - an observable of actions dispatched
<br/>
`dispatch` - a function to call to dispatch new actions
<br/>
Now we can dispatch actions, subscribe to actions being dispatched, and get notified of every state change.
```js
store.state$.subscribe(state => console.log(state))
store.action$.subscribe(action => console.log(action))

store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'DECREMENT'})
```

Now let's see how we manage effects.

#### Effects example
Things to note here:
<br/> 
First - reducer is not relevant for this example.
<br />
Second - we use `stream-lite` library to work with observables [but you don't have to](#adapters).
```js
 import {createStore, combineEffects, runEffects, ofType} from 'amnis'
 import {tap, switchMap, mapTo} from 'stream-lite/operators'
 import {never} from 'stream-lite/statics'
  
 const logAll = action$ => action$.pipe(
	 tap(console.log),
	 switchMap(never),
 )
 
 const pong = action$ => action$.pipe(
	 ofType('PING'),
	 mapTo(({type: 'PONG'})),
 )
 
 const rootReducer = (state, action) => 'irrelevant'
 
 const store = createStore(rootReducer)
 
 runEffects(store, combineEffects(logAll, pong))
 
 store.dispatch({type: 'PING'})
```

## <a id="adapters"></a> 🚀 Choose your own observable library

Internally `amnis` uses `stream-lite`. Mostly because it's core is only ***900KB***, but also because of it's RxJS-like interface and support for [pipeable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md).
<br/>
But you can use any observable library that you want!
<br/>
Lies! I will actually push this functionality in the next release 🙃

## 📓 Examples
Stay tuned. Examples are coming.

## 🙏 License
MIT