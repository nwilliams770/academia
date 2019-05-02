// We only want to update a small slice of state, in this case,
// the comment list for the corresponding post
//  this pattern is called REDUCER COMPOSTION

function postComments(state = [], action) {
    switch(action.type) {
        case 'ADD_COMMENT':
        // return the state with new comment, e.g. return the updated array of comments cooresponding to that post
            return [...state, {
                user: action.author,
                text: action.comment
            }]
        case 'REMOVE_COMMENT':
            console.log('Removing a comment');
            // need to return new state without deleted comment
            //  where i is the index of the commnet to delete
            return [
                ...state.slice(0,action.index),
                ...state.slice(action.index + 1)
            ]
        default:
            return state
    }
}

function comments(state = [], action) {
    if (typeof action.postId !== 'undefined') {
        return {
            // take current state
            ...state,
            // overwrite this post with a new one

            // using square brackets so that the KEY of this object can be a varaible

            [action.postId]: postComments(state[action.postId], action)
        }
    }
    return state;
}

export default comments; 