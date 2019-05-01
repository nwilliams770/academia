import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from "../actions/actionCreators";
import Main from './Main'

// instead of using React.createClass, we use connect which
// accepts two functions that will take state (posts and comments)
//  and dispatch (action creators) and surface them in our components via props
function mapStateToProps(state) {
    return {
        posts: state.posts,
        comments: state.comments
    }
}

// note that dispatch function being passed in is the same
// one that is a part of our store!
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;