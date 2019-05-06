# React Design Patterns
##  Conditionals in JSX
Prefer use of short-circuit evaluation
```javascript
return isTrue && <p>True!</p>
return person.job || 'unemployed'
```
Complex logic should be moved into sub-componenents if not an IFEE that returns values using if-else statements inside
[docs](https://reactjs.org/docs/conditional-rendering.html)

## Async Nature of setState()
React batches updates and flushes it out once per frame. However, in some cases React has no control over batching, hence updates are made synchronously e.g. eventListeners, Ajax, setTimeout

setState does not immediately mutate this.state but creates a pending state transition, accessing `this.state` after calling this method can potentially return the exsting value. 

In using other Web APIs, the state before and after are different, and that render was called immediately after triggering the setState method. React synchronously updates in these cases because it does not understand or can control this code outside its own library, therefore cannot do the usual performance optimisations and deems to safer/more defensive to update state on the spot and make sure the code that follows has access to the latest information possible

Good snippet for binding functions
``` javascript
class TestComponent extends React.Component {
  constructor(...args) {
    super(...args);

    [
      '_onTimeoutHandler',
      '_onMouseLeaveHandler',
      '_onClickHandler',
      '_onAjaxCallback',
    ].forEach(propToBind => {
      this[propToBind] = this[propToBind].bind(this);
    });
  }
}
```

## Dependency Injection
Directly passing down props to componenets can become overly complex when handing multiple layers of nested components and multiple properties to pass down. Lots of components will have to mention properties that they are not interested in.
Most React components derive their dependencies via props how how do these dependencies reach that point

One way is to use a higher-order component to inject data:
```javascript
var title = 'React Dependency Injection';
export default function inject(Component) {
  return class Injector extends React.Component {
    render() {
      return (
        <Component
          {...this.state}
          {...this.props}
          title={ title }
        />
      )
    }
  };
}
```
```javascript
export default function Title(props) {
  return <h1>{ props.title }</h1>;
}
```
```javascript
import inject from './inject.jsx';
import Title from './Title.jsx';

var EnhancedTitle = inject(Title);
export default function Header() {
  return (
    <header>
      <EnhancedTitle />
    </header>
  );
}
```

React has the concept of context, it's something every component may have access to, a single model which we can access from everywhere
Data is passed top-down but this can be cumbersome for certain types of props (locale preference, UI theme) that are required by many components. Examples, authenticated user, theme, or preferred language.

Be mindful! Context is not designed to just prevent long threads of prop passing but to make more ubiquitious props easily available to components.
In the case of threading down props, consider passing down entire components so that its higher-level components don't need to concern themselves with actual data values but instead with an abstracted-away representation of that data i.e. what it's being used for

Refer to [docs](https://reactjs.org/docs/context.html) for examples, paying not to situations that may call for `render props`

## Context Wrapper
Good practice that context is not just a POJO but has an interface that allows us to store and retrieve data:
```javascript
// dependencies.js
export default {
  data: {},
  get(key) {
    return this.data[key];
  },
  register(key, value) {
    this.data[key] = value;
  }
}
```
The problem with this is we need to specify the contextTypes every time we need to access the context. We can wrap it in a higher-order component and write a utility func that is more descriptive and helps use declare the exact wiring:
```javascript
export default function wire(Component, dependencies, mapper) {
  class Inject extends React.Component {
    render() {
      var resolved = dependencies.map(this.context.get.bind(this.context));
      var props = mapper(...resolved);

      return React.createElement(Component, props);
    }
  }
  Inject.contextTypes = {
    data: PropTypes.object,
    get: PropTypes.func,
    register: PropTypes.func
  };
  return Inject;
};
```
Regarding mapper function: It receives what's stored in the context as a raw data and returns an object which is the actual React props for our component (Title). In this example we just pass what we get - a title string variable. However, in a real app this could be a collection of data stores, configuration or something else.

## Event Handlers
More performant to bind eventHandler functions in the constructor as opposed to inline (.e.g. in render) as it prevents bind from being called at each component render
Other alternative is arrow functions for the onClick prop function assigned as they don't affect the context at invocation time.
Why do we bind functions again anyway? To keep to scope

## Flux pattern for data handling
Refer to Flux notes

## One way data flow
One-way direction data flow eliminates multiple states and deals with only one, which is updated in slices, which is usually in our store. We can use Flux to create a pattern of reducers and action creators. Action creators are made available to our components via props and will dispatch actions, triggering store updates via the appropriate reducer

Note that, in order to hook everything together, we create a special wrapper component -- commonly called a "container" -- reducers are listening (note that we combine them usually into a rootReducer), and updated state. This container wraps the view with mapStateToProps + mapDispatchToProps

## Presentational and container components
Problem: data and logic mixed together.
Containers know about data, it's shape and where it comes from. They know all the business logic as well as format information for the presentational component. Often higher-order components and their render method only contains the presentational component.
```javascript
// Clock/index.js
import Clock from './Clock.jsx'; // <-- that's the presentational component

export default class ClockContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {time: props.time};
    this._update = this._updateTime.bind(this);
  }

  render() {
    return <Clock { ...this._extract(this.state.time) }/>;
  }

  componentDidMount() {
    this._interval = setInterval(this._update, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _extract(time) {
    return {
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds()
    };
  }

  _updateTime() {
    this.setState({time: new Date(this.state.time.getTime() + 1000)});
  }
};
```

Presentational components are concerned with the UI, they have the markup to make the page pretty. No dependencies and not bound to anything, very often implemented as stateless functional component. 
```javascript
// Clock/Clock.jsx
export default function Clock(props) {
  var [ hours, minutes, seconds ] = [
    props.hours,
    props.minutes,
    props.seconds
  ].map(num => num < 10 ? '0' + num : num);

  return <h1>{ hours } : { minutes } : { seconds }</h1>;
};
```

Oftentimes a file exporting a container does not export a class directly but a function that accepts the presentational component as an argument.

## Hooks 
[docs](https://reactjs.org/docs/hooks-overview.html)

New addition in React 16.8. They let you use state and other React features without writing a class
Why hooks?
**It's hard to reuse stateful logic between components**
  - No way to 'attach' reusable behavior to a component (for example, connecting it to store)
  - We can use higher-order components but we can end up with "wrapper hell"
  - "Hooks allow you to reuse stateful logic without changing your component hierarchy"
**Complex components become hard to understand**
  - components can grow into a mess of stateful logic and side effects. Example being a mix of unrelated logic in component lifecycle methods, `componentDidMount` fetches data but might also contain logic to setup event listeners
  - "Hooks let you split one component into smaller functions based on what pieecs are related (such as setting up a subscription or fetching data)", rather than forcing a split based on life cycle methods
**Classes confuse both people and machines**
  - classes can be difficult as you must properly understand how `this` works in JS, must bind event handlers, distinction between function and class components and when to use each one
  - can encourage unintentional patterns that can slow down optimizations
  - Hooks let you use more of React's features without classes

Hooks are backwards compatible and work side-by-side with existing code so you can adopt them gradually

`useState` is a hook that returns the current state value and a function that lets you update it. The only argument to `useState` is the initial state you provide it, which doesn't have to be a POJO but can be.
```javascript
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```
Note the array destructing syntax allows us to name the current state value and updaet function
**Hooks don't work inside classes**. They are functions that let you "hook into" React state and lifecycle features from function components.

**Effect Hook**
`useEffect` adds ability to perform side effects from a function component, serves same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` but in a unified API

`useEffect` can also be used to subscribe and unsubscribe. Effects may optionally specify how to "clean up" adfter them by returning a function. Note that in case of subscription, the component will unsubscribe **both** when the component unmounts as well as before re-running the effect due to a subsequent render. We can tell React to skip re-subscribing if, let's say, nothing changed that needed a re-render of that component

You can use multiple `useEffects` per component so you can organize by whats related

2 rules:
  - Only call hooks at the top level. Don't use them inside conditionals, loops, or nested funcs
  - Only call hooks from React function components

Hooks are a way to reuse **stateful logic**, not state itself. each call to a hook has a completely isolated state. Naming convention of custom hooks is `use` + Something

## Third Party Integration
When working in third party libraries, such a jQuery, there may be instances where you want to relinquish some DOM control to them as opposed to React.
In cases of adding nodes to the DOM, we may be doing a double render because both jQuery and React will be doing work on the same DOM elements. 
To achieve a single-render, `shouldComponentUpdate` be used in order to relinquish control from React and allow jQuery to take the wheel

## Passing Function to setState()
React batches state changes for perofrmance reasons, so state may not change immediately after `setState` is called, it is async! That means you can't rely on current state when called `setState`. One workaround is passing a function to `setState`:
```javascript
this.setState((prevState, props) => ({
  count: prevState.count + props.increment
}));
// Variations
this.setState({ expanded: !this.state.expanded });
this.setState(prevState => ({ expanded: !prevState.expanded }));
```

## Feature Flags
Feature switches/toggles are an important technique that can help us deploy code in various environments under different conditions without blocking other devs from releasing their features.
Say we've a React project with 4 environments:
  - Development (local dev)
  - Testing (where tests run)
  - Staging (product-like environment, minification bundling, etc)
  - Prod
We can use flags and webpack config file to toggle features on/off depending on the environment but we have other options available to us as well.
Using react and redux, we can implement a component wrapper that accepts the component and the feature flag, displaying the new feature based on the flag.
Implemented really nicely in this [gist](https://gist.github.com/RStankov/0e764f27daf38f2fcd81b82360334528)


# 10 React Mini Patterns
[source](https://hackernoon.com/10-react-mini-patterns-c1da92f068c5)
1. Sending data down and up
Nothing new here..passing data down from parent to child

2. Fixing HTML's inputs
Creating small input components for all the various types of HTML inputs as well as return values from an onChangem method, not JS Event instance.
Ensure data type returned in onChange method matches what's passed in. If `typeof props.value` is int, convert `e.target.value` back to int before sending it out

3. Binding labels to inputs with unique IDs
`<label>` els should be bound to `<input>` via an `id` / `for` combo but instead of thinking of unique names for each input, you can create a module that gives an incrementing ID
```javascriptå
let count = 1;

export const resetId = () => {
  count = 1;
}

export const getNextId = () => {
  return `element-id-${count++}`;

```
`getNextId()` increments a number each time it's called

4. Controlling CSS with props
Three distinct ways to control CSS applied to a component
- Using themes `<Button theme="secondary">`
- Using flags (a boolean prop) `<Button theme="secondary" rounded>`, like HTML binary attribs, you don't need to do `rounded={true}`
- Setting values `<Icon width="25" height="25" type="search">`

5. The switching component
Switching component is one that renders one of many components. Nice snippet:
```javascript
import HomePage from './HomePage.jsx';
import AboutPage from './AboutPage.jsx';
import UserPage from './UserPage.jsx';
import FourOhFourPage from './FourOhFourPage.jsx';

const PAGES = {
  home: HomePage,
  about: AboutPage,
  user: UserPage
};

const Page = (props) => {
  const Handler = PAGES[props.page] || FourOhFourPage;

  return <Handler {...props} />
};

// The keys of the PAGES object can be used in the prop types to catch dev-time errors.
Page.propTypes = {
  page: PropTypes.oneOf(Object.keys(PAGES)).isRequired
};
```
`<Page page="home" />`, if we replace the keys with `/`, `/about`, and `/user`, you're en route to making a router

6. Reaching into a component
A nice UX touch is to have `autofocus` on inputs. You'd think we could just manually select the input and focus it using JS. We can make this more reliable by not having it rely on a string (.e.g the id of the input) by adding a focus method to the input component:
```javascript
class Input extends Component {
  focus() {
    this.el.focus();
  }
  
  render() {
    return (
      <input
        ref={el=> { this.el = el; }}
      />
    );
  }
}
```
And we can call this method from it's parent
```javascript

class SignInModal extends Component {
  componentDidMount() {
    this.InputComponent.focus();
  }
  
  render() {
    return (
      <div>
        <label>User name: </label>
        <Input
          ref={comp => { this.InputComponent = comp; }}
        />
      </div>
    )
  }
}
```
NOTE: when you use `ref` on a component, it's a reference to the component (not the underlying element) so we have access to its methods!

7. Almost-components
Be mindful on when it's appropriate to use a method and a component. You can always have a var that returns some markup to be rendered in the component, no need to write a whole new component for that.

8. Components for formatting text
Consider your applications. If you are going to formatting a bunch of numbers all over different components, it may be best to use a number formatting wrapper instead of rewriting the same formatting methods across different components!
```javascript
const Price = (props) => {
    const price = props.children.toLocaleString('en', {
      style: props.showSymbol ? 'currency' : undefined,
      currency: props.showSymbol ? 'USD' : undefined,
      maximumFractionDigits: props.showDecimals ? 2 : 0,
    });
    
    return <span className={props.className}>{price}</span>
};

Price.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.number,
  showDecimals: React.PropTypes.bool,
  showSymbol: React.PropTypes.bool,
};

Price.defaultProps = {
  children: 0,
  showDecimals: true,
  showSymbol: true,
};

const Page = () => {
  const lambPrice = 1234.567;
  const jetPrice = 999999.99;
  const bootPrice = 34.567;
  
  return (
    <div>
      <p>One lamb is <Price className="expensive">{lambPrice}</Price></p>
      <p>One jet is <Price showDecimals={false}>{jetPrice}</Price></p>
      <p>Those gumboots will set ya back <Price showDecimals={false} showSymbol={false}>{bootPrice}</Price> bucks.</p>
    </div>
  );
};
```

9. The store is the component's servant
- Work out general structure of your compoments and the data they will require
- Design your store to support those requirements
- Do whatever you need to do to your incoming data to make it fit into the store

Recommended to write a single module that does all the "massaging"/normalizing of incoming data. Renaming of props, casting strings to numbers, objects into arrays, date strings into date objects, whatever you need
Simple pattern for a fetch in a potential action creator
```javascript
fetch(`/api/search?${queryParams}`)
.then(response => response.json())
.then(normalizeSearchResultsApiData) // the do-it-all data massager
.then(normalData => {
    // dispatch normalData to the store here
});
```

10. Importing components without relative paths
Create a single `index.js` somewhere that exports references to each of your components
Use webpack's `resolve.alias` to redirect `Components` to that index file