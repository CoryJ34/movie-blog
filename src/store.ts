import { createStore, applyMiddleware } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers/rootReducer';

// const composedEnhancer = composeWithDevTools(
//   // Add whatever middleware you actually want to use here
//   applyMiddleware()
//   // other store enhancers if any
// )

// @ts-ignore
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export default store
