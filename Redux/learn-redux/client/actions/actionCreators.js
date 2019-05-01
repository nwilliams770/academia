// Why do we call these action creators? The returned object is what is the actual action
// The functions just create and dispatch the action

// Actions can be seen as JS Events that just fire off, if no one is listening then nothing happens
// In comes reducers! we need a reducer for EACH piece of state e.g. comments and posts


//  Increment (likes) | accepts index/id of like
export function increment(index) {
    return {
        type: 'INCREMENT_LIKES',
        index
    }
}
// add comment
export function addComment(postId, author, comment) {
    return {
        type: 'ADD_COMMENT',
        postId,
        author,
        comment
    }
}

// remove comment 
export function removeComment(postId, index) {
    return {
        type: 'REMOVE_COMMENT',
        index,
        postId
    }
}