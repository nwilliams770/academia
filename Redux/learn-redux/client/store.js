import { createStore, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';

// import root reducer
import rootReducer from './reducers/index.js';

import comments from './data/comments'
import posts from './data/posts'

// create object for default data

const defaultState = {
    posts,
    comments,
};

// How to sync our chrome redux devtools with our store
const enhancers = compose(
    // if window has redux dev tool, run it, otherwise just return store
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

// View store an empty object where we'll store all app data
const store = createStore(rootReducer, defaultState, enhancers);

export const history = syncHistoryWithStore(browserHistory, store);

// To hot reload reducers, accept the hot reload, then require the reduce
if (module.hot) {
    module.hot.accept('./reducers/',() => {
        // cannot use import inside a func so must use require
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    })
}

export default store;
