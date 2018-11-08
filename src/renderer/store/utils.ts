import { Action, AnyAction } from "redux";

/**
 * TODO: Do something like this but that infers action type so that you get intellisense insided the function
 function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
*/

