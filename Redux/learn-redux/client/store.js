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

// View store an empty object where we'll store all app data
const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
