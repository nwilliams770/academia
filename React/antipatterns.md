# React Antipatterns
## Props in initial state
From docs:
>Using props to generate state in getInitialState often leads to duplication of “source of truth”, i.e. where the real data is. This is because getInitialState is only invoked when the component is first created.
BAD:
```javascript
class SampleComponent extends Component {
  // constructor function (or getInitialState)
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      inputVal: props.inputValue
    };
  }

  render() {
    return <div>{this.state.inputVal && <AnotherComponent/>}</div>
  }
}
```
With this current implementation, our inputValue will never update when the prop value changes, the prop value should be placed directly in the render function

## findDOMNode()
Use callback refs over findDOMNode()
But what exactly are refs?
- Typically, props are the only way that parent components interact with their children but there are cases where you pust modify a child outside the typical dataflow
- A couple cases are managing focus, text selection, triggering imperative animations, integrating third-party DOM libraries

## Use higher order components over mixins
You've never even used mixins before so just know to swerve em for life!

## setState() in componentWillMount()
Avoid async initialization in `componentWillMount()`. It is invoked immediately before mounting occurs and is called before `render()`, therefore seting state in this method will not trigger a re-render

Make those async calls in `componentDidMount` instead of `componentWillMount`

## Mutating state
This causes state changes without making the component re-render, and whenever setState gets called in the future, the mutated state will be applied.
e.g. use setState! Don't just add items into your state all willy nilly

## Using indexes as keys
Using indexes as keys will make each element's key be based on ordering rather than tied to the actual data being display. (Apparently?) this limits React's optimizations <= although I couldn't find support for this in the docs
An alternative to do the ID that is being used in the server entry? 

## Spreading props on DOM elements
Spreading props, we run into the risk of adding unknow HTML attribs. 
We can specify the props we want to to pass in a var or we can also use destructing with `...rest`

