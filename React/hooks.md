### React Docs on Hooks [source](https://reactjs.org/docs/hooks-intro.html)
* Hooks are new in React 16.8 and allows us to use state and other React features without writing a class.

Must note that:
* Hooks are completely opt-in
* 100% backwards-comptible

Motivation:
* It's hard to reuse stateful logical between components
    * No way to "attach" reusable behavior to a component (ex, connecting it to a store)
    * Higher-order components and render props try to solve this but require restructuring of components which can be cumbersome and result in hard to read code
    * We don't want 'wrapper hell': React needs a better primitive for sharing stateful logic
    * Hooks allow you to reuse stateful logic without changing your component hierarchy
* Complex components become hard to understands
    * Components start out simple but can grow into unmanageable messes of stateful logic and side effects
    * Components might perform some data fetching in `componentDidMount` and `componentDidUpdate` however the same `componentDidMount` might also contain unrelated logic that sets up event listeners, with cleanup performed in `componentWillUnmount`
    * In many cases we can't break these components up because the stateful logic is all over the place
    * Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching datas) rather than forcing a split based on lifecycle methods
* Classes confuse both people and machines
    * Classes require someone to understand how `this` works in JS, you have to bind event handlers, very verbose code
    * Classes don't minify well and make hot reloading flaky
    * Hooks let you use for of React's features without classes. React components are closer to functions and hooks embrace functions!

An Overview (with examples!):
State Hook:
```javascript
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
`useState` is our Hook, we call it inside a function to add some state to it. This state will be preserved by React between re-renders. `useState` returns a pair, the current state value and function that lets you update it. Only arg for `useState` is the initial state, in this example, we used 0 because our counter starts from 0

The State Hook may be used more than once in a single component
```javascript
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

Hooks are functions that let you "hook into" React state and lifecycle features from **function componenets**. React provides a few built-in Hooks like `useState` but you can create your own to reuse stateful beahvior between components

Effect Hook:
* Data fetching, subscriptions, or manually changing the DOM from React components, these operations are called "side effects" ("effects" for short) because they can affect other components and can't be done during rendering

`useEffect` adds the ability to perform side effects from a function component. Same purpose as `componentDidMount`, `componentDidUpdate` and `componentWillUnmount` but unified into a single API
```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
When you call `useEffect`, you're telling the "effect" function to run after flushing changes to the DOMs. By default, React runs the effects after each render *including* the first render. 

Effects may optionally specify how to "clean up" after themselves by returning a function:
```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```
Just like `useState`, we can use more than a single effect in a component

Rules of Hooks:
Hooks are JS functions but impose two additional rules:
* Only call Hooks **at the top level**. Don't call Hooks inside loops, conditions, or nested functions
* Only call Hooks **from React function components**. Don't call hooks from regular JavaScript functions 
* There's linter plugin to help you adhere to these rules!

Building Your Own Hooks:
```javascript
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
``` 

Now putting it to use in some components
```javascript
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```
Note that the state of these components is completely independent. Hooks are a way to reuse *stateful logic*, **not state itself**. Each *call* to a Hook has a completely isolated state -- so you can even use the same custom Hook twice in a component.

Other Hooks:
Less commonly used built-in Hooks are `useContext`, lets you subscribe to React context without introducing nesting, and `useReducer`, lets you manage local state of comple components with a reducer.

Using the State Hook:
`const [count, setCount] = useState(0);`
^ note we use array destructuring here to get the state variable and updater function, we could just as easily, yet more verbosely, do this:
```javascript
var fruitStateVariable = useState('banana'); // Returns a pair
var fruit = fruitStateVariable[0]; // First item in a pair
var setFruit = fruitStateVariable[1]; // Second item in a pair

//   Also note we can use more ergg complex data types when setting our state:
const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```
In a class component, we initialize state in the contructor using `this.state = {}` but in a function component, we have no `this` and instead use `useState` Hook directly inside our component: `const [count, setCount] = useState(0);`

In a class component, to read state, we would call `this.state.count` but in a function component, we can use `count` directly

In a class component, we'd call `this.setState({ count: this.state.count + 1 })` but with hooks we can use the function provided by `useState` to update the `count` state: `setCount(count + 1)`

Must be noted that unlike `this.setState` in a class, updating a state variable always *replaces* it instead of merging it.

Using the Effect Hook:
If you're familiar with the lifecycle methods, think of `useEffect` as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined

Sometimes we want to run some additional code after React has updated the DOM. Network requests, manual DOM mutations, and logging are common examples that don't require cleanup. Let's look at an example in class components then using hooks in a function component
```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

See how we have to repeat out code in both lifecycle methods? No fun! Using hooks we can become less verbose:
```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
by using `useEffect`, we're telling React that our component has somethingelse to do after render. React will remember this "effect" function and call it after performing DOM updates. Here we just update the document title but we could also fetch some data or call some other APIs.

Note that this function getting passed to `useEffect` will be a **different function on every render*. Everytime we render, we schedule a different effect, replacing the previous one

`useEffect` runs after *every* render, including **the first render**

Effects with Cleanup:
We may want to set up a subscription to some external data source and in that case it's important to clean up so we don't introduce a memory leak

In React we'd do this in `componentDidMount` and `componentWillUnmount` but with Hooks, we can *return* a function in `useEffect` that will be run when it is time to clean up:
```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    // NOTE: we do NOT need to return a named function, can we return an array function or call it something different than 'cleanup'
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```
React will perform clean up when the component unmounts BUT, as we learned, effects run for every render and this is why React *also* cleans up effects from previous render before running the effects next time. We can opt our of this bheavior in case it creates performance issues.

Explanation: Why Effects Run on Each Update
One may be wondering why the effect cleanup phase happens after every re-render, not just once during unmounting. Let's see why this design helps us create less buggy components
```javascript
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```
If our `friend` prop changes, we would continue displaying online status of a different friend, and also cause a memory leak when unmounting as the unsubscribe call would use the wrong friend ID. 
In a class model, we'd need `componentDidUpdate` to handle this:
```javascript
  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

Using Hooks we'd see somrthing like this:
```javascript
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```
No special code for handling updates because `useEffect` handles them by default. It cleans up previous effects before applying next effects 

In some cases, cleaning up or applying the effect after every render might create perofrmance issues. In class components, we'd compare our `prevProps` and `prevState` in `componentDidUpdate` and perform the appropriate actions.
With Hooks, you can tell React to "skip" applying an effect if certain values haven't changed between re-renders:
```javascript
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

This also works for effects that have a cleanup phase:
```javascript
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

If you use this optimization, make sure the array includes **all values from the component scope that change over time and that are used by the effect**
If you want to run an effect and clean it up only once (on mount and unmount) you can pass an empty array `[]` as second arg. 

Some good examples of custom hooks on [this page](https://reactjs.org/docs/hooks-custom.html)

### React Hooks -- Why and How [source](https://medium.com/frontmen/react-hooks-why-and-how-e4d2a5f0347)

Not a ton of great insight here compared to the docs BUT some good examples of useReducer and writing custom hooks:
```javascript
const initialState = {count: 0};

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      // A reducer must always return a valid state.
      // Alternatively you can throw an error if an invalid action is dispatched.
      return state;
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, {count: initialCount});
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'reset'})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```