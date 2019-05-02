import React from 'react';
import { render } from 'react-dom';

// import css | handled by webpack, no need for a link tag in HTML, 
// webpack will put it in JS and wrap it in a <style> tag
// must provide relative path
import css from './styles/style.styl';

import App from './components/App';
import Single from './components/Single';
import PhotoGrid from './components/PhotoGrid';

// NOTE: This router structure pattern is for < v4. See migration guide for new pattern 
// and API https://github.com/ReactTraining/react-router/blob/25776d4dc89b8fb2f575884749766355992116b5/packages/react-router/docs/guides/migrating.md#the-router

// import react router dependencies
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux'; // bindings that allows us to use redux with react
import store, { history } from './store';

// Add sentry, a client side error tracking
import Raven from 'raven-js';
import { sentry_url } from './data/config';

Raven.config(sentry_url, {
    tags: {
        git_commit: "blah blah",
        userLevel: "editor"
    }
}).install();


const router = (
    // Provider exposes our store to our application
    <Provider store={store}>
        <Router history={history}>
        {/* We are nesting the Routes here because our Main (e.g. header) will always be rendered
        IndexRoute implies homepage component */}

        {/* If it matches anything e,g, "/", render Main but depending on URL structure, pass Main
        Single or Photogrid, which will be CHILDREN of the main component */}
            <Route path="/" component={App}>
                <IndexRoute component={PhotoGrid}></IndexRoute>
                <Route path="view/:postId" component={Single}></Route>
            </Route>
        </Router>
    </Provider>

)

render(router, document.getElementById('root'));