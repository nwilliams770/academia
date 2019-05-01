import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import posts from './posts';
import comments from './comments';

// There are really 3 things in living in state: posts, comments, and URL changes
const rootReducer = combineReducers({posts, comments, routing: routerReducer});

export default rootReducer;