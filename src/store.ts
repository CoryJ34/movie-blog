import { createStore, applyMiddleware } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers/rootReducer';

// const composedEnhancer = composeWithDevTools(
//   // Add whatever middleware you actually want to use here
//   applyMiddleware()
//   // other store enhancers if any
// )

const store = createStore(rootReducer)
export default store
