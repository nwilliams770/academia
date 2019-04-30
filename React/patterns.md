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


