### Caching React Event Listeners to Improve Performance [source](https://medium.com/better-programming/cache-your-react-event-listeners-to-improve-performance-769bf74d3a4f)
* In JS, objects AND functions are references, which directly impacts React performance. Let's take a closer look at this:
    * In JS we don't have the notion of pointers but in actuality, each time we create an address or write a function we are allocating memory
    * The 'variable' is just an address to that memory which is why:
```javascript
const object1 = {};
const object2 = {};
const object3 = object1; // Be mindful here, now object1 and object3 point to the same place in memory therefore BOTH may be interacted with to mutate that space e.g. adding/removing properties
object1 === object2; // false
object1 === object3; // true
```
How does this come to play with React?
* React's smart rendering! If a component's props and state haven't changed, component will not re-render. It only renders as needed. How is this done?
    * React using the `==` operator to determine if props and state are equal, it **does not** use shallow (comparison of all key-value pairs as opposed to memory address) or deep comparison (compares all nested objects as well) to determine if they are equal
    * React merely checks if the *refernces are the same*
    * Functions are handled the same way; an indentical function with a different memory address will trigger a re-render but the same memory address (e.g. refernce to a function) will not
* Let's see an example of when we can see this in the wild:
```javascript
class SomeComponent extends React.PureComponent {

// The 'get' keyword means the function is a getting for a property; to use it, just use it's name as you would any other property
// It will bind an object property to a function, when the property is looked up now the getter function is called
  get instructions() {
    if (this.props.do) {
      return 'Click the button: ';
    }
    return 'Do NOT click the button: ';
  }

  render() {
    return (
      <div>
        {this.instructions}
        <Button onClick={() => alert('!')} />
      </div>
    );
  }
}
```
* Every time `SomeComponent` is re-rendered (such as toggling `this.props.do` from `true` to `false`), `Button` is re-rendered as well! Why?
    * The `onClick` handler, despite being exactly the same, is being *created* in memory every render call, so `Button`, as far as React is concerned, is receiving something 'new' every time because the memory address has changed

The Fix:
* If your function doesn't depend on your component e.g. `this` contexts, you can define it **outside** the component.
* If your function does depend on your component, you can pass a method of your component as the event handler as opposed to writing it inline
* There are some more advanced cases however, and a lot of them can be made simpler by employing **memoization**: an optimization technique used primarily to improve speed performance by storing the results of expensive functions and return the cached result when the same inputs occur again
    * In our case, for each unique value, create and cache a function, for all future references to that unique value, return the previously cached function
```javascript
class Button extends React.Component {
    onClick = () => {
        const { text, onClick } = this.props;
        onClick(text);
    }

    render() {
        return <button onClick={this.onClick} />;
    }
}

class SomeComponent extends React.Component {
    onClickButton = text => {
        console.log(text);
    }

    render() {
        const { list } = this.props;
        return (
            <ul>
                {list.map(({ text }) => (
                    <li key={text}>
                        <Button text={text} onClick={this.onClickButton} />
                    </li>
                ))}
            </ul>
        );
    }
}
```