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