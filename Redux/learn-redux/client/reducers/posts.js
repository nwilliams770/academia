// a reducer takes in:
// 1. the action (info about what happened)
// 2. a copy of current state

// action, store => ok let me see => updated copy of store based on action

function posts(state = [], action) {
    console.log("The post will change");
    console.log(state, action);
    return state;
}

export default posts; 
