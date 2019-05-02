// a reducer takes in:
// 1. the action (info about what happened)
// 2. a copy of current state

// action, store => ok let me see => updated copy of store based on action

// Reducer functions MUST be pure, meaning that the same input ALWAYS returns the same results. 
// In order to achieve this, we return a NEW state as opposed to mutating state
// If we did mutate our state, we'd lose predictability

// *** Question *** Why is the entire state not being passed? Somehow, Redux knows to only pass posts here
function posts(state = [], action) {
    switch(action.type) {
        case 'INCREMENT_LIKES':
            console.log("Incrementing likes!");
            const i = action.index
            return [
                ...state.slice(0,i), // before the post we are updating
                {...state[i], likes: state[i].likes + 1},
                ...state.slice(i + 1)
            ]
        default:
            return state;
    }
}

export default posts; 
