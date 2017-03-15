//=== import the common packages ===
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import thunk from 'redux-thunk';
//=== import internal ===
import {reducers} from './middle';

class store {
  constructor() {
    // create new store to apply in system  
    const store = createStore(
      combineReducers({ // combine all reducers and apply for this store
        ...reducers,
        routing
      }),
      applyMiddleware(thunk)
    );

    return store;
  }
}
// export this class to apply in index.js
export default new store();
